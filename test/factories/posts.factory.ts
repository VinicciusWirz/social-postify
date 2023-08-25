import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PostsFactory {
  static async build(prisma: PrismaService) {
    return await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        text: faker.internet.url(),
        image: faker.internet.url(),
      },
    });
  }
}
