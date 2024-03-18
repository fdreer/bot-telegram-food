import { config } from 'dotenv'

config()

export const {
  OPENAI_API_KEY,
  GOOGLE_AUTH_KEY,
  GOOGLE_AUTH_EMAIL,
  BOT_TOKEN,
  SHEET_ID
} = process.env
