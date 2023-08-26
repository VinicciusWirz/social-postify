import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let repository: PostsRepository;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PostsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<PostsRepository>(PostsRepository);
  });

  describe('Find all posts', () => {
    it('should return empty array', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([]);

      const posts = await service.findAll();
      expect(posts).toHaveLength(0);
    });

    it('should return expected object', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([
        {
          id: 1,
          title: dto.title,
          text: dto.text,
          image: null,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ]);

      const posts = await service.findAll();
      expect(posts).toHaveLength(1);
      expect(posts[0]).toEqual({ id: 1, title: dto.title, text: dto.text });
    });
  });

  describe('Find one post', () => {
    it('should return expected post array', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        title: dto.title,
        text: dto.text,
      });

      const post = await service.findOne(1);
      expect(post).toHaveLength(1);
      expect(post[0]).toEqual({ id: 1, title: dto.title, text: dto.text });
    });

    it('should return expected object', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        title: dto.title,
        text: dto.text,
        image: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      const post = await service.findOne(1);
      expect(post).toHaveLength(1);
      expect(post[0]).toEqual({ id: 1, title: dto.title, text: dto.text });
    });

    it('should throw not found error', () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const post = service.findOne(1);
      expect(post).rejects.toThrow(new NotFoundException());
    });
  });

  describe('Create new post', () => {
    it('should create new post', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      const date = new Date();
      jest.spyOn(repository, 'create').mockResolvedValueOnce({
        id: 1,
        text: dto.text,
        title: dto.title,
        image: null,
        createdAt: date,
        updatedAt: date,
      });
      const post = await service.create(dto);
      expect(post).toEqual({ id: 1, ...dto });
    });
  });

  describe('Update post', () => {
    it('should update post', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      const date = new Date();
      const serverResponse = {
        id: 1,
        text: dto.text,
        title: dto.title,
        image: null,
        createdAt: date,
        updatedAt: date,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(serverResponse);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(serverResponse);

      const updatedPost = await service.update(1, dto);
      expect(updatedPost).toEqual([{ id: 1, ...dto }]);
    });
    it('should throw not found error', () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const updatedPost = service.update(1, dto);
      expect(updatedPost).rejects.toThrow(new NotFoundException());
    });
  });

  describe('Delete post', () => {
    it('should delete post', async () => {
      const dto = new CreatePostDto();
      dto.text = 'mock-text';
      dto.title = 'mock-title';
      delete dto.image;
      const date = new Date();
      const serverResponse = {
        id: 1,
        text: dto.text,
        title: dto.title,
        image: null,
        createdAt: date,
        updatedAt: date,
      };

      jest.spyOn(repository, 'remove').mockResolvedValueOnce(serverResponse);
      const post = await service.remove(1);
      expect(post).toEqual('Post 1 deleted');
    });

    it('should throw not found error', () => {
      jest.spyOn(repository, 'remove').mockRejectedValueOnce({ code: 'P2025' });

      const updatedPost = service.remove(1);
      expect(updatedPost).rejects.toThrow(new NotFoundException());
    });

    it('should throw forbidden error', () => {
      jest.spyOn(repository, 'remove').mockRejectedValueOnce({ code: 'P2003' });

      const updatedPost = service.remove(1);
      expect(updatedPost).rejects.toThrow(new ForbiddenException());
    });
  });
});
