import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { UpdateUserDto } from '../user/dto/updateUser.dto';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Types } from 'mongoose';

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.genreService.bySlug(slug);
	}

	@Get('/collections')
	async getCollections() {
		return this.genreService.getCollections();
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAll(searchTerm);
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id', new IdValidationPipe()) id: string) {
		return this.genreService.byId(id);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', new IdValidationPipe()) id: string,
		@Body() dto: CreateGenreDto,
	) {
		return this.genreService.update(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async Create(): Promise<Types.ObjectId> {
		return this.genreService.create();
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', new IdValidationPipe()) id: string) {
		return this.genreService.delete(id);
	}
}
