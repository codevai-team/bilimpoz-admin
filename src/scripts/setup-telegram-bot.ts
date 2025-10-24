import { prisma } from '../lib/prisma'

async function setupTelegramBot() {
  try {
    const botToken = process.argv[2]
    
    if (!botToken) {
      console.log('Использование: npm run setup-telegram-bot <токен_бота>')
      console.log('Пример: npm run setup-telegram-bot "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"')
      process.exit(1)
    }

    // Проверяем, существует ли уже настройка
    const existingSetting = await prisma.settings.findUnique({
      where: { key: 'bot_id' }
    })

    if (existingSetting) {
      // Обновляем существующую настройку
      await prisma.settings.update({
        where: { key: 'bot_id' },
        data: { value: botToken }
      })
      console.log('✅ Токен Telegram бота обновлен')
    } else {
      // Создаем новую настройку
      await prisma.settings.create({
        data: {
          key: 'bot_id',
          value: botToken
        }
      })
      console.log('✅ Токен Telegram бота добавлен')
    }

    console.log('🔧 Настройка завершена!')
    console.log('📝 Не забудьте:')
    console.log('   1. Получить telegram_id пользователей')
    console.log('   2. Добавить telegram_id в таблицу users')
    console.log('   3. Протестировать отправку сообщений')

  } catch (error) {
    console.error('❌ Ошибка при настройке Telegram бота:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTelegramBot()
