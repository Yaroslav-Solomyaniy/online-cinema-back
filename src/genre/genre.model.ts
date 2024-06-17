import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface GenreModel extends Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class GenreModel extends TimeStamps {
	@Prop()
	name: string;
	@Prop({ unique: true })
	slug: string;
	@Prop()
	description: string;
	@Prop()
	icon: string;
}
