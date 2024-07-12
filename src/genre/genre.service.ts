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
		const collections = await Promise.all(
			genres.map(async (genre) => {
				// Устанавливаем флаг throwOnEmpty в false, чтобы не выбрасывать исключение
				const moviesByGenre = await this.movieService.byGenres(
					[genre._id],
					false,
				);

				// Если нет фильмов для жанра, пропускаем его
				if (!moviesByGenre) return null;

				const result: ICollection = {
					_id: String(genre._id),
					image: moviesByGenre.bigPoster ? moviesByGenre.bigPoster : null,
					slug: genre.slug,
					title: genre.name,
				};

				return result;
			}),
		);

		// Убираем null значения из массива коллекций
		return collections.filter((collection) => collection !== null);
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
