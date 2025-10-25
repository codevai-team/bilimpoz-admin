'use client'

// Утилиты для работы с аутентификацией на клиентской стороне

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
  
  if (!authCookie) return null
  
  return authCookie.split('=')[1]
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  
  document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders()
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
}
