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

  findAll(published: boolean = false, after?: Date) {
    const today = new Date();
    let query: { where?: { date?: { lt?: Date; gt?: Date } } } = {};
    (published || after) && (query = { where: { date: {} } });

    published && (query.where.date = { lt: today });
    after && (query.where.date = { lt: today, gt: after });

    return this.prisma.publication.findMany(query);
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
    return `This action removes a #${id} publication`;
  }
}
