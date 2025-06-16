import { Telegraf, Markup} from "telegraf"
import config from "config"
import { message } from 'telegraf/filters'
// import { deepSeek } from './deepseek.js'
import { chatGPT } from './chatGPT.js'
import { create } from './notion.js'
import {Loader} from './loader.js'


const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {handlerTimeout: Infinity,})


bot.command('start', ctx => {
	ctx.reply('Добро пожаловать в бота. Отправьте сообщение')
} )

bot.command('special', (ctx) => {
    return ctx.reply(
        'Специальные кнопки:',
        Markup.keyboard([
            Markup.button.contactRequest('Отправить контакт'),
            Markup.button.locationRequest('Отправить локацию')
        ]).resize()
    );
});

bot.on('location', (ctx) => {
    const location = ctx.message.location;
    return ctx.reply(`Получена локация: ${location.latitude}, ${location.longitude}`);
});



bot.on(message('text'), async (ctx) => {
	try {
		const text = ctx.message.text
		if (!text.trim()) ctx.reply('Текст не может быть пустым')

		const loader = new Loader(ctx)

		loader.show()

		const response = await chatGPT(text)
		response.trim('**', '*')
		

		if (!response) return ctx.reply('Ошибка с API', response)

		// const notionResponse = await create(text, response.content)		

		// ctx.reply(`Ваша страница: ${notionResponse.url}`)

		loader.hide()

		ctx.reply(`📌*История для вас:*\n ${response}`,
					// '```\n' +  // Тройные кавычки создают блок кода с серым фоном
					// `${response}\n` +
					// '```'					
  					{ parse_mode: 'Markdown' })
		
	} catch (e) {
		console.log('Error while processing text: ', e.message)
	}
	// await chatGPT(ctx.message.text)
	// ctx.reply('test')
})

bot.launch()

// Включить graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));