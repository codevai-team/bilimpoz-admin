import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function middleware(request: NextRequest) {
  // Проверяем, если пользователь пытается получить доступ к защищенным маршрутам
  const protectedPaths = ['/dashboard']
  const { pathname } = request.nextUrl

  // Если это защищенный маршрут
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // Проверяем наличие токена в cookies или localStorage (для клиентской стороны)
    // Для серверной стороны токен должен передаваться через Authorization header
    
    // Для dashboard страниц проверяем токен из cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      // Перенаправляем на страницу входа
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Проверяем валидность токена
    const payload = verifyToken(token)
    if (!payload) {
      // Токен недействителен, перенаправляем на страницу входа
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Проверяем роль пользователя (только админы могут попасть в dashboard)
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

