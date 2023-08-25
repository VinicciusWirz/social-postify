import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    @Inject(forwardRef(() => MediasService))
    private readonly mediasService: MediasService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  async create(body: CreatePublicationDto) {
    const { mediaId, postId, date } = body;
    await this.findDependencies(body.mediaId, body.postId);
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

  async update(id: number, body: CreatePublicationDto) {
    await this.findDependencies(body.mediaId, body.postId);
    const { date } = await this.findOne(id);
    const today = new Date();
    const published = date.getTime() < today.getTime();

    if (published) throw new ForbiddenException();
    return await this.publicationsRepository.update(
      id,
      new UpdatePublicationDto(body.mediaId, body.postId, body.date),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.publicationsRepository.remove(id);
  }

  private async findDependencies(mediaId: number, postId: number) {
    await this.mediasService.findOne(mediaId);
    await this.postsService.findOne(postId);
  }
}
