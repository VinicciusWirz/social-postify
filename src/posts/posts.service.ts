import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

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

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postsRepository.remove(id);
  }

  private formatParams(post: Post): CreatePostDto {
    delete post.createdAt;
    delete post.updatedAt;
    !post.image && delete post.image;
    return post;
  }
}
