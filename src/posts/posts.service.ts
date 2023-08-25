import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
  ) {}

  async create(body: CreatePostDto) {
    const post = await this.postsRepository.create(body);
    return this.formatParams(post);
  }

  async findAll() {
    const postList = await this.postsRepository.findAll();
    return postList.map((post) => {
      return this.formatParams(post);
    });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (!post) throw new NotFoundException();
    return [this.formatParams(post)];
  }

  async update(id: number, body: CreatePostDto) {
    await this.findOne(id);
    const post = await this.postsRepository.update(id, body);
    return [this.formatParams(post)];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.postsRepository.remove(id);
    return `Post ${id} deleted`;
  }

  private formatParams(post: Post): CreatePostDto {
    delete post.createdAt;
    delete post.updatedAt;
    !post.image && delete post.image;
    return post;
  }
}
