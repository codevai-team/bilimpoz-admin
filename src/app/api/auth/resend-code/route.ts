import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { telegramService } from '@/lib/telegram'
import { generateVerificationCode, storeVerificationCode } from '@/lib/verification'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Валидация входных данных
    if (!userId) {
      return NextResponse.json(
        { error: 'ID пользователя обязателен' },
        { status: 400 }
      )
    }

    // Получаем пользователя из базы данных
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        telegram_id: true,
        status: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (!user.telegram_id) {
      return NextResponse.json(
        { error: 'У пользователя не привязан Telegram' },
        { status: 400 }
      )
    }

    if (user.status === 'banned' || user.status === 'deleted') {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован или удален' },
        { status: 403 }
      )
    }

    try {
      // Генерируем и сохраняем новый код подтверждения
      const verificationCode = generateVerificationCode()
      storeVerificationCode(user.id, verificationCode)

      // Отправляем код в Telegram
      const messageSent = await telegramService.sendVerificationCode(user.telegram_id, verificationCode)
      
      if (!messageSent) {
        console.error('Failed to resend Telegram message to user:', user.id)
        return NextResponse.json({
          error: 'Ошибка отправки кода в Telegram'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Новый код подтверждения отправлен в Telegram'
      })

    } catch (telegramError) {
      console.error('Telegram service error:', telegramError)
      return NextResponse.json({
        error: 'Ошибка при отправке кода подтверждения'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Resend code error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
