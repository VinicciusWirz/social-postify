import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { FormattingHelper } from '../helpers/formatting.helper';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(body: CreatePostDto) {
    const post = await this.postsRepository.create(body);
    const postFilterImage = this.filterImage(post);
    return FormattingHelper.removeDbDates(postFilterImage);
  }

  async findAll() {
    const postList = await this.postsRepository.findAll();
    return postList.map((post) => {
      const postFilterImage = this.filterImage(post);
      return FormattingHelper.removeDbDates(postFilterImage);
    });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (!post) throw new NotFoundException();
    const postFilterImage = this.filterImage(post);
    return [FormattingHelper.removeDbDates(postFilterImage)];
  }

  async update(id: number, body: CreatePostDto) {
    await this.findOne(id);
    const post = await this.postsRepository.update(id, body);
    const postFilterImage = this.filterImage(post);
    return FormattingHelper.removeDbDates(postFilterImage);
  }

  async remove(id: number) {
    try {
      await this.postsRepository.remove(id);
      return `Post ${id} deleted`;
    } catch (error) {
      if (error.code === 'P2003') throw new ForbiddenException();
      if (error.code === 'P2025') throw new NotFoundException();
    }
  }

  private filterImage(post: Post) {
    !post.image && delete post.image;
    return post;
  }
}
