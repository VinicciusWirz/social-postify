import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    medias.forEach((m) => {
      delete m.createdAt;
      delete m.updatedAt;
    });
    return medias;
  }

  async findOne(id: number) {
    const media = await this.mediasRepository.findById(id);
    if (!media) throw new NotFoundException();
    delete media.createdAt;
    delete media.updatedAt;
    return [media];
  }

  async update(id: number, body: CreateMediaDto) {
    const mediaById = await this.mediasRepository.findById(id);
    if (!mediaById) throw new NotFoundException();

    const combinationExists = await this.findCombination(body);
    if (combinationExists) throw new ConflictException();

    const updateMedia = await this.mediasRepository.update(id, body);
    delete updateMedia.createdAt;
    delete updateMedia.updatedAt;

    return updateMedia;
  }

  async remove(id: number) {
    return await this.mediasRepository.remove(id);
  }

  private async findCombination(body: CreateMediaDto) {
    return await this.mediasRepository.findCombination(body);
  }
}
