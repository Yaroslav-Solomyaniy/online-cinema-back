import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../user/user.model';
import { MovieModel } from '../movie/movie.model';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RatingModel extends Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RatingModel extends TimeStamps {
	@Prop({ ref: () => UserModel })
	userId: Ref<UserModel>[];

	@Prop({ ref: () => MovieModel })
	movieId: Ref<MovieModel>[];

	@Prop()
	value: number;
}
