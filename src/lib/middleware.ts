import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Проверяем, если пользователь пытается получить доступ к защищенным маршрутам
  const protectedPaths = ['/dashboard']
  const { pathname } = request.nextUrl

  // Если это защищенный маршрут
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // В реальном приложении здесь была бы проверка JWT токена
    // Пока что просто пропускаем все запросы
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
