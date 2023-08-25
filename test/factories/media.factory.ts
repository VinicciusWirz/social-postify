import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class MediasFactory {
  static async build(prisma: PrismaService) {
    return await prisma.media.create({
      data: {
        title: faker.company.name(),
        username: faker.internet.url(),
      },
    });
  }
}
