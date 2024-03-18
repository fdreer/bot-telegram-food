import { GoogleSpreadsheet } from 'google-spreadsheet'
import {
  GoogleSpreadsheetCredentials,
  ISpreadsheetService,
  OrderType,
  Product,
  ProductType,
  ProductTypeSheets
} from '../../types'
import { InputFile } from 'grammy'

export default class GoogleSpreadSheetService implements ISpreadsheetService {
  private doc: GoogleSpreadsheet

  constructor(credentials: GoogleSpreadsheetCredentials) {
    this.doc = new GoogleSpreadsheet(credentials.sheetId, credentials.jwt)
    this.doc.loadInfo()
  }

  getProducts = async () => {
    const sheet = this.doc.sheetsByTitle['Menu']
    const rows = await sheet.getRows<ProductType>()

    const products: ProductType[] = rows.map((row) => {
      const menu: string = row.get(Product.MENU)
      const emoji: string = row.get(Product.EMOJI)
      const description: string = row.get(Product.DESCRIPTION)
      const price: string = row.get(Product.PRICE)

      const normalizeData = this.normalizeData({
        menu,
        emoji,
        description,
        price
      })

      return normalizeData
    })

    return products
  }

  registerOrder = async (order: OrderType) => {
    const sheet = this.doc.sheetsByTitle['Pedidos']

    const res = await sheet.addRow({
      user: 'Franco',
      address: 'Los chaniares 45',
      order: 'Comida gratis',
      total: '1234',
      state: 'Pendiente'
    })
  }

  findCv = async () => {
    return new InputFile(
      'C:\\Users\\franc\\Desktop\\bot-telegram\\public\\cv_franco_dreer.pdf'
    )
  }

  private normalizeData = (data: ProductTypeSheets): ProductType => {
    const priceNormalized = Number(
      data.price.trim().replace('$', '').replace(',', '.')
    )

    return {
      menu: data.menu.trim(),
      description: data.description.trim(),
      price: priceNormalized,
      emoji: data.emoji.trim()
    }
  }
}
