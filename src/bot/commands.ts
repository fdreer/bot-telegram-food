import AIClass from '../service/openai/index'
import { getInitialMessage, mapMenu } from './messages'
import { doYouWantToOrder, randomTextKeyboard } from './keyboards'
import { ISpreadsheetService, MyContext } from '../types'

type CommandsProps = {
  ctx: MyContext
  spreadSheetService: ISpreadsheetService
  ai?: AIClass
}

const command = {
  start: async (ctx: MyContext) => {
    const initialMessage = getInitialMessage()
    await ctx.reply(initialMessage, {
      parse_mode: 'HTML'
    })
  },
  getMenu: async ({ ctx, spreadSheetService }: CommandsProps) => {
    await ctx.reply(`Ahora mismo te paso el menú de hoy...`)
    const menu = await spreadSheetService.getProducts()
    const mappedMenu = mapMenu(menu)
    await ctx.reply(mappedMenu, {
      parse_mode: 'HTML'
    })
    await ctx.reply(`Quieres hacer un pedido?`, {
      reply_markup: doYouWantToOrder
    })
  },
  randomText: async (ctx: MyContext) => {
    await ctx.reply(
      `👋 Hola!! Soy tu asistente virtual de <b>La Cocina SA</b> y estoy para ayudarte con tus consultas.`,
      {
        parse_mode: 'HTML'
      }
    )

    await ctx.reply(`En que te puedo ayudar?`, {
      reply_markup: randomTextKeyboard
    })
  }
}

export default command
