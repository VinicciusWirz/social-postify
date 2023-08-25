import { ForbiddenException, Injectable } from '@nestjs/common';
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

  findById(id: number) {
    return this.prisma.media.findUnique({ where: { id } });
  }

  update(id: number, body: CreateMediaDto) {
    return this.prisma.media.update({ data: body, where: { id } });
  }

  async remove(id: number) {
    try {
      return await this.prisma.media.delete({ where: { id } });
    } catch (error) {
      if (error.meta?.field_name.includes('fkey')) throw new ForbiddenException();
      console.log({ ...error });
    }
  }
}
