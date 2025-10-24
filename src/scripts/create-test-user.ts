import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function createTestUser() {
  try {
    // Проверяем, существует ли уже пользователь с логином admin
    const existingUser = await prisma.users.findUnique({
      where: { login: 'admin' }
    })

    if (existingUser) {
      console.log('Пользователь admin уже существует')
      return
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword('admin123')

    // Создаем тестового пользователя
    const user = await prisma.users.create({
      data: {
        name: 'Администратор',
        login: 'admin',
        hash_password: hashedPassword,
        language: 'ru',
        status: 'verified',
        role: 'admin'
      }
    })

    console.log('Тестовый пользователь создан:', {
      id: user.id,
      name: user.name,
      login: user.login,
      role: user.role
    })

  } catch (error) {
    console.error('Ошибка при создании пользователя:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
