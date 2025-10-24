import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { telegramService } from '@/lib/telegram'
import { generateVerificationCode, storeVerificationCode } from '@/lib/verification'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    // Валидация входных данных
    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Поиск пользователя в базе данных
    const user = await prisma.users.findUnique({
      where: {
        login: login
      },
      select: {
        id: true,
        name: true,
        login: true,
        hash_password: true,
        role: true,
        status: true,
        telegram_id: true
      }
    })

    // Проверка существования пользователя
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    // Проверка статуса пользователя
    if (user.status === 'banned' || user.status === 'deleted') {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован или удален' },
        { status: 403 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await verifyPassword(password, user.hash_password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    // Успешная авторизация - отправляем код подтверждения в Telegram
    const { hash_password, ...userWithoutPassword } = user

    // Проверяем наличие telegram_id
    if (!user.telegram_id) {
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Авторизация успешна',
        requiresTelegramVerification: true
      })
    }

    try {
      // Генерируем и сохраняем код подтверждения
      const verificationCode = generateVerificationCode()
      storeVerificationCode(user.id, verificationCode)

      // Отправляем код в Telegram
      const messageSent = await telegramService.sendVerificationCode(user.telegram_id, verificationCode)
      
      if (!messageSent) {
        console.error('Failed to send Telegram message to user:', user.id)
        return NextResponse.json({
          error: 'Ошибка отправки кода в Telegram'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Код подтверждения отправлен в Telegram',
        requiresVerification: true
      })

    } catch (telegramError) {
      console.error('Telegram service error:', telegramError)
      return NextResponse.json({
        error: 'Ошибка при отправке кода подтверждения'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
