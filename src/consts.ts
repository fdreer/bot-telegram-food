import { BOT_TOKEN, GOOGLE_AUTH_EMAIL, GOOGLE_AUTH_KEY } from './config/index'
import { JWT } from 'google-auth-library'
import { Command } from './types'
import { BotCommand } from 'grammy/types'

export const jsonwebtoken = new JWT({
  email: `${GOOGLE_AUTH_EMAIL}`,
  key: `${GOOGLE_AUTH_KEY}`.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

export const BOT = {
  TOKEN: `${BOT_TOKEN}`,
  DEVELOPER: 652240016,
  COMMANDS: [
    { command: Command.START, description: 'Iniciar el bot' },
    { command: Command.MENU, description: 'Para saber el menú de hoy' },
    { command: Command.ORDER, description: 'Para hacer tu pedido' },
    { command: Command.INVOICE, description: 'Para pedir tu factura' },
    { command: Command.CLAIM, description: 'Para hacer un reclamo' }
  ] as BotCommand[],
  DESCRIPTION:
    '\nEste asistente virtual puede ayudarte a tomar los pedidos del dia de hoy.'
}
