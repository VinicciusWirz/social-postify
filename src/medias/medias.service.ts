import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormattingHelper } from '../helpers/formatting.helper';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}
  async create(body: CreateMediaDto) {
    const media = await this.findCombination(body);
    if (media) throw new ConflictException();
    return await this.mediasRepository.create(body);
  }

  async findAll() {
    const medias = await this.mediasRepository.findAll();
    medias.forEach((media) => {
      return FormattingHelper.removeDbDates(media);
    });
    return medias;
  }

  async findOne(id: number) {
    const media = await this.mediasRepository.findById(id);
    if (!media) throw new NotFoundException();

    return [FormattingHelper.removeDbDates(media)];
  }

  async update(id: number, body: CreateMediaDto) {
    const mediaById = await this.mediasRepository.findById(id);
    if (!mediaById) throw new NotFoundException();

    const combinationExists = await this.findCombination(body);
    if (combinationExists) throw new ConflictException();

    const updateMedia = await this.mediasRepository.update(id, body);

    return FormattingHelper.removeDbDates(updateMedia);
  }

  async remove(id: number) {
    try {
      await this.mediasRepository.remove(id);
      return `Media ${id} deleted`;
    } catch (error) {
      if (error.code === 'P2003') throw new ForbiddenException();
      if (error.code === 'P2025') throw new NotFoundException();
    }
  }

  private async findCombination(body: CreateMediaDto) {
    return await this.mediasRepository.findCombination(body);
  }
}
