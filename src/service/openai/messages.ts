import { ChatCompletionMessageParam } from 'openai/resources'
import { ProductType } from '../../types'

export const generateSystemMessage = (products: ProductType[]) => {
  let todayMenu = ''
  let exampleResponse = ''

  for (const { menu, description } of products) {
    todayMenu += `\n- ${menu}: ${description.toLowerCase()}`

    const random = Math.floor(Math.random() * 3) + 1
    exampleResponse += `- ${random} ${random > 1 ? 'menús' : 'menú'} ${menu}\n`
  }

  const message: ChatCompletionMessageParam = {
    role: 'system',
    content: `You will be provided with food orders whose format may vary. Your task is to understand what the customer wants to ask for and respond to a certain message.\n\nToday\'s menu:${todayMenu}\n\nCustomer order can:\n- Use synonyms or abbreviations.\n- May have spelling and grammatical errors, therefore pay special attention to these issues.\n- Be sorted by the menu name or by its description.\n- The number of menus can be with numbers or words.\n\nYou will simply respond:\n- "ERROR", when you don\'t understand what the customer means.\n- "NOT_MATCH", when any of the requested menus does not match any of the available ones.\n\nBased on the menu and what the customer wants, respond with the following format:\n"${exampleResponse}"`
  }

  return message
}
