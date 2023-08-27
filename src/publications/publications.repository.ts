import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(body: UpdatePublicationDto) {
    const { date, mediaId, postId } = body;
    return this.prisma.publication.create({ data: { date, mediaId, postId } });
  }

  findAll(published?: boolean, after?: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          lt: published ? new Date() : undefined,
          gte: after ? after : published === false ? new Date() : undefined,
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.publication.findUnique({ where: { id } });
  }

  update(id: number, body: UpdatePublicationDto) {
    const { date, mediaId, postId } = body;
    return this.prisma.publication.update({
      where: { id },
      data: { date, mediaId, postId },
    });
  }

  remove(id: number) {
    return this.prisma.publication.delete({ where: { id } });
  }
}
