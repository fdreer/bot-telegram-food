import AIClass from '../service/openai/index'
import {
  ISpreadsheetService,
  MyContext,
  MyConversation,
  ProductType
} from '../types'
import { generateSystemMessage } from '../service/openai/messages'
import { confirmationOrder } from './keyboards'
import { calculateTotal } from './utils'

const conversation = (spreadSheetService: ISpreadsheetService, ai: AIClass) => {
  return {
    getUserInfo: async (conversation: MyConversation, ctx: MyContext) => {
      await ctx.reply('Cual es su email?')
      const { message: email } = await conversation.waitFor('message::email')
      await ctx.reply('¿Podría decirnos su domicilio?')
      const { message: address } = await conversation.waitFor('message:text')
      conversation.log(email, address)
    },
    order: async (conversation: MyConversation, ctx: MyContext) => {
      let completion: string // --> se guarda tal cual en el sheets
      let menu: ProductType[]

      await ctx.reply(
        '¿Qué tenes ganas de comer hoy?\n\n/cancel --> para cancelar el pedido'
      )

      // TODO: para no ejecutar este bloque y gastar presupuesto en ChatGPT
      // Podriamos detectar si estamos en ambiente de desarrollo o produccion, de esa manera
      // sabemos si tenermos que ejecutar un codigo u otro
      // Para ambiente de desarrollo un mock

      do {
        const { message } = await conversation.waitFor('message:text')

        if (message?.text === '/cancel') {
          await ctx.reply('Pedido cancelado')
          return
        }

        menu = await conversation.external(() =>
          spreadSheetService.getProducts()
        )

        const systemMessage = generateSystemMessage(menu)

        completion = await conversation.external(() =>
          ai.createChat([
            systemMessage,
            { role: 'user', content: message.text }
          ])
        )

        if (completion === 'ERROR') {
          await ctx.reply(
            'Disculpe, no entendi el pedido que quiso hacer. Podría repetirlo?'
          )
        }

        if (completion === 'NOT_MATCH') {
          await ctx.reply(
            'Disculpe, no tenemos disponible el/los menús que está ordenando.'
          )
        }
      } while (completion === 'ERROR' || completion === 'NOT_MATCH')

      if (!conversation.session.address) {
        await ctx.reply('Para qué domicilio es el pedido?')
        const { message: address } = await conversation.waitFor('message:text')
        conversation.session.address = address.text
      }

      const totalToPay = await conversation.external(() =>
        calculateTotal(completion, menu)
      )

      await ctx.reply(
        `Confirmas el siguiente pedido?\n${completion}\nPara ${conversation.session.address}\nTotal a pagar: $${totalToPay}`,
        {
          reply_markup: confirmationOrder // --> acá deberiamos enviar un menú para guardar el pedido en un sheets
        }
      )

      return
    }
  }
}

export { conversation }
