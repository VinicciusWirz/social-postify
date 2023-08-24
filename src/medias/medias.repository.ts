import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(body: CreateMediaDto) {
    return this.prisma.media.create({ data: body });
  }

  findCombination(body: CreateMediaDto) {
    return this.prisma.media.findFirst({ where: body });
  }

  findAll() {
    return this.prisma.media.findMany();
  }
}
