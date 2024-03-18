import AIClass from './service/openai'
import GoogleSpreadSheetService from './service/sheets/google-service'
import { OPENAI_API_KEY, SHEET_ID } from './config/index'
import { BOT, jsonwebtoken } from './consts'
import { myBot } from './bot'

const init = async () => {
  const ai = new AIClass(OPENAI_API_KEY, 'gpt-4-0125-preview')

  const googleService = new GoogleSpreadSheetService({
    sheetId: SHEET_ID,
    jwt: jsonwebtoken
  })

  const bot = await myBot({
    token: BOT.TOKEN,
    spreadSheetService: googleService,
    ai
  })

  await bot.start()
}

init()
