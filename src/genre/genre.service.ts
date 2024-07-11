import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { GenreModel } from './genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Types } from 'mongoose';
import { MovieService } from '../movie/movie.service';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService,
	) {}

	async bySlug(slug: string) {
		const doc = await this.GenreModel.findOne({ slug }).exec();

		if (!doc) throw new NotFoundException('Genre not found');
		return doc;
	}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						descriptions: new RegExp(searchTerm, 'i'),
					},
				],
			};
		return this.GenreModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			});
	}

	async getCollections() {
		const genres = await this.getAll();
		return await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.movieService.byGenres([genre._id]);

				const result: ICollection = {
					_id: String(genre._id),
					image: moviesByGenre.bigPoster,
					slug: genre.slug,
					title: genre.name,
				};

				return result;
			}),
		);
	}

	//admin

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id);

		if (!genre) throw new NotFoundException('Genre not found');
		return genre;
	}

	async getCount() {
		return this.GenreModel.find().count().exec();
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();
		if (!updateGenre) throw new NotFoundException('Genre not found');

		return updateGenre;
	}

	async create(): Promise<Types.ObjectId> {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			icon: '',
			description: '',
		};

		const genre = await this.GenreModel.create(defaultValue);
		return genre._id;
	}

	async delete(id: string) {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(id).exec();
		if (!deleteGenre) throw new NotFoundException('Genre not found');
		return deleteGenre;
	}
}
