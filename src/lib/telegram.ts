import { prisma } from './prisma'

export interface TelegramMessage {
  chat_id: string
  text: string
}

export class TelegramService {
  private botToken: string | null = null

  async getBotToken(): Promise<string> {
    if (this.botToken) {
      return this.botToken
    }

    const setting = await prisma.settings.findUnique({
      where: { key: 'ADMIN_BOT_TOKEN' }
    })

    if (!setting?.value) {
      throw new Error('Telegram bot token not found in settings')
    }

    this.botToken = setting.value
    return this.botToken
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      const botToken = await this.getBotToken()
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Telegram API error:', result)
        return false
      }

      return result.ok
    } catch (error) {
      console.error('Error sending Telegram message:', error)
      return false
    }
  }

  async sendVerificationCode(telegramId: string, code: string): Promise<boolean> {
    const message = `
🔐 <b>Код подтверждения входа</b>

Ваш код: <code>${code}</code>

Введите этот код на странице авторизации для завершения входа в систему.

⏰ Код действителен в течение 5 минут.
    `.trim()

    return await this.sendMessage(telegramId, message)
  }
}

export const telegramService = new TelegramService()
