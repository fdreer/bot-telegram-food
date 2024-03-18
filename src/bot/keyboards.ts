import { InlineKeyboard, Keyboard } from 'grammy'

export const randomTextKeyboard = new InlineKeyboard()
  .text('Menú de hoy', 'menu')
  .text('Hacer un pedido', 'pedido')
  .row()
  .text('Facturación', 'facturacion')
  .text('Reclamo', 'reclamo')

export const confirmationOrder = new Keyboard()
  .text('Confirmar pedido')
  .row()
  .text('Cancelar pedido')
  .row()
  .text('Cambiar domicilio')
  .oneTime()
  .resized()

export const doYouWantToOrder = new Keyboard()
  .text('Sí, quiero pedir')
  .row()
  .text('No quiero pedir')
  .oneTime()
  .resized()
