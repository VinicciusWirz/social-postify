import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { MediasService } from '../medias/medias.service';
import { PublicationsRepository } from './publications.repository';
import { MediasRepository } from '../medias/medias.repository';
import { PostsService } from '../posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  controllers: [PublicationsController],
  providers: [
    PublicationsService,
    PublicationsRepository,
    MediasService,
    MediasRepository,
    PostsService,
    PostsRepository,
  ],
})
export class PublicationsModule {}
