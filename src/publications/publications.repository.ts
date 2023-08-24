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

  findAll() {
    return `This action returns all publications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
