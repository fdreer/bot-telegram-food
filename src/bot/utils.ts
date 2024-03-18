import { ProductType } from 'src/types'

export const calculateTotal = (completion: string, menus: ProductType[]) => {
  const products = completion.split('\n')
  let total = 0

  for (const product of products) {
    const parts = product.split(' ') // [ '-', '2', 'menús', 'Golosos' ]
    const qty = parseInt(parts[1])
    const menuName = parts[3]

    const menu = menus.find((m) => m.menu === menuName)
    if (menu) {
      total += menu.price * qty
    }
  }

  return total
}
