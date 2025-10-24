import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/verification'

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

    return NextResponse.json({
      success: true,
      message: 'Код подтвержден успешно'
    })

  } catch (error) {
    console.error('Code verification error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
