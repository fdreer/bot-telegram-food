import { Bot, BotError, GrammyError, HttpError, session } from 'grammy'
import { hydrateFiles } from '@grammyjs/files'
import { ignoreOld } from 'grammy-middlewares'
import { conversations, createConversation } from '@grammyjs/conversations'
import { conversation } from './conversations'
import command from './commands'
import AIClass from '../service/openai/index'
import { confirmationOrderMenu } from './menus'
import { BOT } from '../consts'
import { Command, ISpreadsheetService, MyContext, SessionData } from '../types'

type BotConfigProps = {
  token: string
  spreadSheetService: ISpreadsheetService
  ai: AIClass
}

const errorHandler = (err: BotError) => {
  const ctx = err.ctx
  console.error(`Error mientras manejas el update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error('Error en la request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('No se pudo contactar con Telegram:', e)
  } else {
    console.error('Error desconocido:', e)
  }
}

function createInitialSessionData(): SessionData {
  return {
    address: null
  }
}

export const myBot = async ({
  token,
  spreadSheetService,
  ai
}: BotConfigProps) => {
  const bot = new Bot<MyContext>(token)
  bot.use(
    session({
      initial: createInitialSessionData
      // storage: freeStorage<SessionData>(token)
    })
  )
  bot.use(conversations())
  bot.api.config.use(hydrateFiles(token))

  bot.api.setMyDescription(BOT.DESCRIPTION)

  bot.api.setMyCommands(BOT.COMMANDS)

  // TODO: debería crear un middleware que verifique que dia de la semana es y en base a eso se pueda hablar con el bot o no

  bot.use(ignoreOld(1))
  // En este orden porque primero se tiene que crear el menu y despues la conversacion
  bot.use(confirmationOrderMenu)
  bot.use(createConversation(conversation(spreadSheetService, ai).order))

  // COMANDOS
  bot.command(Command.START, command.start)

  bot.command(
    Command.MENU,
    async (ctx) => await command.getMenu({ ctx, spreadSheetService })
  )

  bot.command(Command.ORDER, async (ctx) => {
    await ctx.conversation.enter('order')
  })

  // COMANDO INICIALES
  bot.callbackQuery(
    Command.MENU,
    async (ctx) => await command.getMenu({ ctx, spreadSheetService })
  )

  bot.callbackQuery(
    Command.ORDER,
    async (ctx) => await ctx.conversation.enter('order')
  )

  bot.callbackQuery(
    Command.INVOICE,
    async (ctx) => await ctx.reply('Método facturación no implemnetado.')
  )

  bot.callbackQuery(
    Command.CLAIM,
    async (ctx) => await ctx.reply('Método reclamo no implemnetado.')
  )

  bot.hears('Sí, quiero pedir', async (ctx) => {
    await ctx.conversation.enter('order')
  })

  bot.hears('No quiero pedir', async (ctx) => {
    await ctx.reply('Ok. Cualquier duda me consultas.')
  })

  bot.hears('Confirmar pedido', async (ctx) => {
    await ctx.reply('Estamos anotando tu pedido...')
  })

  bot.hears('Cancelar pedido', async (ctx) => {
    await ctx.reply('Ok. Cualquier duda me consultas.')
  })

  bot.hears('Cambiar domicilio', async (ctx) => {
    await ctx.reply('Ok. Cual es tu nuevo domicilio?')
    // TODO: plantear logica para cambio de domicilio
  })

  bot.on('message:text', command.randomText) // --> cuando el texto no coincida con ningún midd

  bot.catch(errorHandler)

  return bot
}

// PARA DESCARGAR MENSAJES DE VOZ
// bot.on('message:voice', async (ctx) => {
//   // const voice = ctx.msg.voice
//   // const duration = voice.duration
//   // const fileId = voice.file_id

//   await ctx.reply('Espera unos segundos hasta que guarde tu audio')

//   const file = await ctx.getFile() // válido durante al menos 1 hora
//   // const response = await fetch(file.getUrl())
//   await file.download(
//     'C:\\Users\\franc\\Desktop\\bot-telegram\\public\\nota-de-voz.mp3'
//   )

//   await ctx.reply('Tu mensaje de voz fue guardado satisfactoriamente')
// })

//   try {
//     const file = await obj.getFile()

//     // if (!obj.message.voice) {
//     //   await ctx.reply('El mensaje enviado no es de tipo audio')
//     //   return
//     // }

//     await file.download(
//       'C:\\Users\\franc\\Desktop\\bot-telegram\\public\\nuevo-nota.mp3'
//     )

//     await ctx.reply(
//       `El mensaje se guardó correctamente. Lo estaré escuchando pronto.`
//     )
//   } catch (error) {
//     console.log(error)
//     await ctx.reply(`Oops. Ocurrió un error en nuestros servidores`)
//   }
