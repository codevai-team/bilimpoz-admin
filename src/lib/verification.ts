// Временное хранилище кодов подтверждения (в продакшене лучше использовать Redis)
const verificationCodes = new Map<string, { code: string; expiresAt: Date; userId: string }>()

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeVerificationCode(userId: string, code: string): void {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 минут
  verificationCodes.set(userId, { code, expiresAt, userId })
  
  // Очистка истекших кодов
  setTimeout(() => {
    verificationCodes.delete(userId)
  }, 5 * 60 * 1000)
}

export function verifyCode(userId: string, inputCode: string): boolean {
  const stored = verificationCodes.get(userId)
  
  if (!stored) {
    return false
  }
  
  if (new Date() > stored.expiresAt) {
    verificationCodes.delete(userId)
    return false
  }
  
  if (stored.code !== inputCode) {
    return false
  }
  
  // Код верный, удаляем его
  verificationCodes.delete(userId)
  return true
}

export function getStoredCode(userId: string): string | null {
  const stored = verificationCodes.get(userId)
  
  if (!stored || new Date() > stored.expiresAt) {
    if (stored) {
      verificationCodes.delete(userId)
    }
    return null
  }
  
  return stored.code
}
