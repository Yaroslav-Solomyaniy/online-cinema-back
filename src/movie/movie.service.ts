import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { MovieModel } from './movie.model';
import { UpdateMovieDto } from './update-movie.dto';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
	) {}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			};
		return this.MovieModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec();
	}

	//admin

	async bySlug(slug: string) {
		const docs = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec();

		if (!docs) throw new NotFoundException('Movies not found');
		return docs;
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.findOne({ actors: actorId }).exec();

		if (!docs) throw new NotFoundException('Movies not found');
		return docs;
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.MovieModel.findOne({
			genres: { $in: genreIds },
		}).exec();

		if (!docs) throw new NotFoundException('Movies not found');
		return docs;
	}

	async getMostPopulars() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec();
	}

	async updateCountOpened(slug: string) {
		const updateMovie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } },
			{ new: true },
		).exec();
		if (!updateMovie) throw new NotFoundException('Movie not found');

		return updateMovie;
	}

	async byId(_id: string) {
		const docs = await this.MovieModel.findById(_id);

		if (!docs) throw new NotFoundException('Movie not found');
		return docs;
	}

	async create(): Promise<Types.ObjectId> {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		};

		const movie = await this.MovieModel.create(defaultValue);
		return movie._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {
		const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();
		if (!updateMovie) throw new NotFoundException('movie not found');

		return updateMovie;
	}

	async delete(id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(id).exec();
		if (!deleteMovie) throw new NotFoundException('movie not found');
		return deleteMovie;
	}
}
