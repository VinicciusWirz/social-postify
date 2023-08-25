import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MediasFactory } from './media.factory';
import { PostsFactory } from './posts.factory';

export class PublicationsFactory {
  static async build(
    prisma: PrismaService,
    published: boolean = false,
    date?: Date,
  ) {
    const { id: mediaId } = await MediasFactory.build(prisma);
    const { id: postId } = await PostsFactory.build(prisma);
    return await prisma.publication.create({
      data: {
        mediaId,
        postId,
        date: date ? date : published ? faker.date.past() : faker.date.future(),
      },
    });
  }
}
