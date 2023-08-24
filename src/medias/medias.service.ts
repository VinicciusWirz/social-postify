import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}
  async create(body: CreateMediaDto) {
    const media = await this.findCombination(body);
    if (media) throw new ConflictException();
    return await this.mediasRepository.create(body);
  }

  findAll() {
    return `This action returns all medias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }

  private async findCombination(body: CreateMediaDto) {
    return await this.mediasRepository.findCombination(body);
  }
}
