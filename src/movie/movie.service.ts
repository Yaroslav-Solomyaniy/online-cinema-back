import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { ActorDto } from '../actor/actor.dto';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>,
	) {}

	async bySlug(slug: string) {
		const doc = await this.ActorModel.findOne({ slug }).exec();

		if (!doc) throw new NotFoundException('Actor not found');
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
				],
			};
		return this.ActorModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			});
	}

	//admin

	async byId(_id: string) {
		const actor = await this.ActorModel.findById(_id);

		if (!actor) throw new NotFoundException('actor not found');
		return actor;
	}
	async create(): Promise<Types.ObjectId> {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		};

		const actor = await this.ActorModel.create(defaultValue);
		return actor._id;
	}

	async update(_id: string, dto: ActorDto) {
		const updateActor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();
		if (!updateActor) throw new NotFoundException('actor not found');

		return updateActor;
	}

	async delete(id: string) {
		const deleteActor = await this.ActorModel.findByIdAndDelete(id).exec();
		if (!deleteActor) throw new NotFoundException('actor not found');
		return deleteActor;
	}
}
