import OpenAI from "openai"
import config from 'config'

const CHATGPT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b:free'

const ROLES = {
	ASSISTANT: 'assistant',
	SYSTEM: 'system',
	USER: 'user',
}

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: config.get('OPEN_ROUTER_DEEPSEEK_KEY'),

}) 

const getMessage = (m) => `
	Напиши на основе этих тезисов последовательную поучительную историю: ${m}
	Эти тезисы с описанием непонятных явлений или событий. Необходимо в итоге получить 
	такую историю, чтобы я запомнил объяснение и смог впоследствии рассказывать 
	и объяснять другим людям. Много текста не нужно. Достаточно 4-5 предложений. Главное, чтобы было доступное объяснение, правильная 
	последовательность и учет контекста. В конце истории нужно дать общепринятое научное определение тезисам ${m}
`

export async function chatGPT(message = '') {
	const messages = [
		{
		role: ROLES.SYSTEM, 
		content: 'Ты опытный преподаватель, который пишет краткие, но доступные для понимания занимательные истории для детей в возрасте 10-11 лет.',
			},
		{
			role: ROLES.USER,
			content: getMessage(message)
		}
	]

	try {
		const completion = await openai.chat.completions.create({
		model: CHATGPT_MODEL,
		messages,
		})
		// console.log(completion.choices[0].message.content)
		return completion.choices[0].message.content
	} catch (e) {
		console.error('Error while chat complietion', e.message)
	}
}