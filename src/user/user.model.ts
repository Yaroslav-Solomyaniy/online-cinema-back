import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, Ref } from '@typegoose/typegoose';
import { MovieModel } from '../movie/movie.model';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserModel extends Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserModel extends TimeStamps {
	@Prop({ unique: true })
	email: string;
	@Prop()
	password: string;
	@Prop({ default: false })
	isAdmin?: boolean;
	@Prop({ default: [], ref: () => MovieModel })
	favorites?: Ref<MovieModel>[];
}
