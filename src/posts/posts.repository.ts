import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(body: CreatePostDto) {
    return this.prisma.post.create({ data: body });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  update(id: number, body: CreatePostDto) {
    const { text, title, image } = body;
    return this.prisma.post.update({
      data: { text, title, image: image || null },
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
