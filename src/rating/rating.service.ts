import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RatingModel } from './rating.model';
import { MovieService } from '../movie/movie.service';
import { Types } from 'mongoose';
import { SetRatingDto } from './dto/setRating.dto';

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService,
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return this.RatingModel.findOne({ movieId, userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0));
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto;

		const newRating = await this.RatingModel.findByIdAndUpdate(
			{ movieId, userId },
			{ movieId, userId, value },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		).exec();

		const avarageRating = await this.avarageRatingByMovie(movieId);

		await this.movieService.updateRating(movieId, avarageRating);

		return newRating;
	}

	async avarageRatingByMovie(movieId: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate()
			.match({
				movieId: new Types.ObjectId(movieId),
			})
			.exec();

		return (
			ratingsMovie.reduce((acc, current) => acc + current.value, 0) /
			ratingsMovie.length
		);
	}
}
