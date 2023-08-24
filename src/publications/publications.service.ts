import { Injectable, NotFoundException } from '@nestjs/common';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    private readonly mediasService: MediasService,
    private readonly postsService: PostsService,
  ) {}

  async create(body: CreatePublicationDto) {
    const { mediaId, postId, date } = body;
    await this.mediasService.findOne(body.mediaId);
    await this.postsService.findOne(body.postId);
    const publication = await this.publicationsRepository.create(
      new UpdatePublicationDto(mediaId, postId, date),
    );
    delete publication.updatedAt;
    delete publication.createdAt;
    return publication;
  }

  async findAll(published?: boolean, after?: Date) {
    const publications = await this.publicationsRepository.findAll(
      published,
      after,
    );
    return publications.map(({ id, mediaId, postId, date }) => {
      return { id, mediaId, postId, date };
    });
  }

  async findOne(idInput: number) {
    const publication = await this.publicationsRepository.findOne(idInput);
    if (!publication) throw new NotFoundException();
    const { id, mediaId, postId, date } = publication;
    return { id, mediaId, postId, date };
  }

  update(id: number, updatePublicationDto: CreatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
