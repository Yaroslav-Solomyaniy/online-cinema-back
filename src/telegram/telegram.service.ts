import { Injectable } from '@nestjs/common';
import { Telegram } from './telegram.interface';
import { Telegraf } from 'telegraf';
import { getTelegramConfig } from '../config/telegram.config';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: Telegram;

	constructor() {
		this.options = getTelegramConfig();
		this.bot = new Telegraf(this.options.token);
	}

	async sendMessage(
		message: string,
		options?: ExtraReplyMessage,
		chatId: string = this.options.chatId,
	) {
		await this.bot.telegram.sendMessage(chatId, message, {
			...options,
			parse_mode: 'HTML',
		});
	}

	async sendPhoto(
		photo: string,
		message?: string,
		options?: ExtraReplyMessage,
		chatId: string = this.options.chatId,
	) {
		await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			message && {
				caption: message,
			},
		);
	}
}
