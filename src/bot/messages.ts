import { Command, ProductType } from '../types'

export const getInitialMessage = () => {
  const today = new Date()
  const dayOfWeek = today.toLocaleDateString('es-AR', {
    weekday: 'long',
    timeZone: 'America/Argentina/Buenos_Aires'
  })

  return `Buen día amigos 🥰\nFeliz <b>${dayOfWeek}</b> ✨\n\nTe pasamos los siguientes comandos que podes utilizar para comunicarte con nosotros más facilmente:\n\n/${Command.MENU}: para ver el menú del dia 🍗`
}

export const mapMenu = (products: ProductType[]) => {
  let productsString = 'Nuestro menú del día de hoy 👇🏻\n\n'

  for (const { menu, emoji, description, price } of products) {
    productsString += `${emoji} <b>${menu}</b> - <b>$${price}</b>\n${description}\n\n`
  }

  return productsString.trim()
}
