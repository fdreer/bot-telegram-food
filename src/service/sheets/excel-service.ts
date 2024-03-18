import * as Excel from 'exceljs'

// TODO: implementar interfaz y que getProducts devuelva los datos en un Map
class ExcelService {
  getProducts = async () => {
    const wb = new Excel.Workbook()
    await wb.xlsx.readFile('')

    const wsProducts = wb.getWorksheet('list_products')

    const products = {}

    wsProducts.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const product = row.getCell(1).value
        const price = row.getCell(2).value
        products[product as string] = {
          price
        }
      }
    })

    const filterProducts = Object.keys(products).filter(
      (product) => products[product as string].price > 0.0
    )

    console.log(filterProducts)

    return
  }
}
