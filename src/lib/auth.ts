import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

export interface JWTPayload {
  userId: string
  login: string
  role: string
  iat?: number
  exp?: number
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export async function auth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return null
    }

    // Получаем актуальные данные пользователя из БД
    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        status: true
      }
    })
    
    if (!user) {
      return null
    }

    // Проверяем статус пользователя
    if (user.status === 'banned' || user.status === 'deleted') {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Ошибка аутентификации:', error)
    return null
  }
}
