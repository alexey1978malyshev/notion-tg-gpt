import OpenAI from "openai"
import config from 'config'

//const DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528-qwen3-8b:free"
const GPT_MODEL = "openai/gpt-4.1"


const ROLES = {
	ASSISTANT: 'assistant',
	SYSTEM: 'system',
	USER: 'user',
}

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: config.get("GPT_MODEL_KEY")
})

const getMessage = (m) => `
	Напиши на основе этих тезисов последовательную поучающую историю: ${m}
	Эти тезисы с описанием непонятных моментов . Необходимо в итоге получить 
	такую историю, чтобы я запомнил объяснение и смог впоследствии рассказывать 
	и объяснять другим людям. Много текста не нужно. Достаточно 4-5 предложений. Главное, чтобы было доступное объяснение, правильная 
	последовательность и учет контекста.
`

export async function deepSeek(message = '' ) {
	const messages = [
		{
		role: ROLES.SYSTEM, 
		content: 'Ты опытный копирайтер, который пишет статьи для соцсетей.',
			},
		{
			role: ROLES.USER,
			content: getMessage(message)
		}
	]
	try {
		const completion = await openai.chat.completions.create({
    messages,
    model: GPT_MODEL,
  })
		// console.log(completion.choices[0].message)
		return completion.choices[0].message.content
	} catch (e) {
		console.error("Error while DeepSeek complietion", e.message)		
	}
	
}