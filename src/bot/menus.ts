import { Menu } from '@grammyjs/menu'
import { MyContext } from '../types'

export const confirmationOrderMenu = new Menu<MyContext>(
  'confirmation-order-menu'
)
  .text('SI', async (ctx) => {
    // TODO: se guarda solamente la orden
    await ctx.menu.close({ immediate: true })
    // await ctx.editMessageText('A qué domicilio?')
  })
  .text('NO', async (ctx) => {
    await ctx.menu.close({ immediate: true })
    await ctx.reply('¡Haz cancelado el pedido!')
  })
  .row()
  .submenu('Cambiar domicilio', 'address-menu')

export const addressMenu = new Menu<MyContext>('address-menu')
  .text('Cambiar', async (ctx) => {
    // ctx.menu.close({ immediate: true })
    await ctx.reply('A qué domicilio quieres cambiar?')
  })
  .back('< Volver')

export const main = new Menu('root-menu')
  .text('Bienvenido', (ctx) => ctx.reply('¡Hola!'))
  .row()
  .submenu('Créditos', 'credits-menu')

export const settings = new Menu('credits-menu')
  .text('Mostrar créditos', (ctx) => ctx.reply('Desarrollado por grammY'))
  .back('Volver')
