import { Context, InputFile, SessionFlavor } from 'grammy'
import { FileFlavor } from '@grammyjs/files'
import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { JWT } from 'google-auth-library'

type BotConfig = {
  botDeveloper: number
  isDeveloper: boolean
}

export interface SessionData {
  address: string | null
}

export interface ISpreadsheetService {
  getProducts: () => Promise<ProductType[]>
  registerOrder: (order: OrderType) => Promise<void>
  findCv: () => Promise<InputFile>
}

export type MyContext = FileFlavor<Context> &
  ConversationFlavor & {
    config: BotConfig
  } & SessionFlavor<SessionData>

export type MyConversation = Conversation<MyContext>

export type GoogleSpreadsheetCredentials = {
  sheetId: string
  jwt: JWT
}

export type OrderType = {
  user: string
  address: string
  order: string
  total: string
  state: string
}

export type ProductType = {
  menu: string
  emoji: string
  description: string
  price: number
}

export type ProductTypeSheets = {
  menu: string
  emoji: string
  description: string
  price: string
}

export enum Product {
  MENU = 'menu',
  EMOJI = 'emoji',
  DESCRIPTION = 'description',
  PRICE = 'price'
}

export enum Command {
  START = 'start',
  MENU = 'menu',
  ORDER = 'pedido',
  CLAIM = 'reclamo',
  INVOICE = 'factura'
}
