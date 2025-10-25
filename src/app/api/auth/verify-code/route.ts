import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/verification'
import { generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json()

    // Валидация входных данных
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'ID пользователя и код обязательны' },
        { status: 400 }
      )
    }

    // Проверяем код
    const isValid = verifyCode(userId, code)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный или истекший код' },
        { status: 401 }
      )
    }

    // Получаем данные пользователя для создания токена
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        status: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (user.status === 'banned' || user.status === 'deleted') {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован или удален' },
        { status: 403 }
      )
    }

    // Генерируем JWT токен
    const token = generateToken({
      userId: user.id,
      login: user.login,
      role: user.role
    })

    return NextResponse.json({
      success: true,
      message: 'Код подтвержден успешно',
      token,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Code verification error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
