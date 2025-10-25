import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function createAdminUser() {
  try {
    // Проверяем, есть ли уже админ
    const existingAdmin = await prisma.users.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      console.log('Админ уже существует:', existingAdmin.login)
      return existingAdmin
    }

    // Создаем админа
    const hashedPassword = await hashPassword('admin123')
    
    const admin = await prisma.users.create({
      data: {
        name: 'Администратор',
        login: 'admin',
        hash_password: hashedPassword,
        language: 'ru',
        status: 'verified',
        role: 'admin'
      }
    })

    console.log('Админ создан успешно:', admin.login, 'ID:', admin.id)
    return admin
  } catch (error) {
    console.error('Ошибка создания админа:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()







