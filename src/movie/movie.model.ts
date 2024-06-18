import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, Ref } from '@typegoose/typegoose';
import { ActorModel } from '../actor/actor.model';
import { GenreModel } from '../genre/genre.model';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface MovieModel extends Base {}

export class Parameters {
	@Prop()
	year: number;

	@Prop()
	duration: number;

	@Prop()
	country: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MovieModel extends TimeStamps {
	@Prop()
	poster: string;

	@Prop()
	bigPoster: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop({ unique: true })
	slug: string;

	@Prop()
	parameters?: Parameters;

	@Prop({ default: 4.0 })
	rating?: number;

	@Prop({ default: 0 })
	countOpened?: number;

	@Prop()
	videoUrl: string;

	@Prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[];

	@Prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>[];

	@Prop({ default: false })
	isSendTelegram?: boolean;
}
