import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MediasRepository } from '../medias/medias.repository';
import { MediasService } from '../medias/medias.service';
import { PostsRepository } from '../posts/posts.repository';
import { PostsService } from '../posts/posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PublicationsService } from './publications.service';

describe('PublicationsService', () => {
  let service: PublicationsService;
  let repository: PublicationsRepository;
  let mediasRepository: MediasRepository;
  let postsRepository: PostsRepository;
  let prisma: PrismaService = new PrismaService();

  const dto = new CreatePublicationDto();
  dto.mediaId = 1;
  dto.postId = 1;
  dto.date = new Date('9999-04-20');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationsService,
        PublicationsRepository,
        MediasService,
        MediasRepository,
        PostsService,
        PostsRepository,
        PrismaService
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    service = module.get<PublicationsService>(PublicationsService);
    repository = module.get<PublicationsRepository>(PublicationsRepository);
    mediasRepository = module.get<MediasRepository>(MediasRepository);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  describe('Find all publications', () => {
    it('should return empty array', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([]);

      const publications = await service.findAll();
      expect(publications).toHaveLength(0);
    });

    it('should return expected object', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([
        {
          id: 1,
          mediaId: dto.mediaId,
          postId: dto.postId,
          date: dto.date,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ]);

      const publications = await service.findAll();
      expect(publications).toHaveLength(1);
      expect(publications[0]).toEqual({
        id: 1,
        mediaId: dto.mediaId,
        postId: dto.postId,
        date: dto.date,
      });
    });
  });

  describe('Find one publication', () => {
    it('should return expected object', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        mediaId: dto.mediaId,
        postId: dto.postId,
        date: dto.date,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      const publications = await service.findOne(1);
      expect(publications).toEqual({
        id: 1,
        mediaId: dto.mediaId,
        postId: dto.postId,
        date: dto.date,
      });
    });

    it('should throw not found error', () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const publications = service.findOne(1);
      expect(publications).rejects.toThrow(new NotFoundException());
    });
  });

  describe('Create new publication', () => {
    it('should create expected publication', async () => {
      jest.spyOn(mediasRepository, 'findById').mockResolvedValueOnce({
        id: 1,
        title: 'mock-title',
        username: 'mock-username',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        text: 'mock-text',
        title: 'mock-title',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(repository, 'create').mockResolvedValueOnce({
        id: 1,
        mediaId: 1,
        postId: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const publication = await service.create(dto);
      expect(publication).toEqual({
        id: 1,
        mediaId: 1,
        postId: 1,
        date: expect.any(Date),
      });
    });

    it('should throw not found error when media does not exist', () => {
      jest.spyOn(mediasRepository, 'findById').mockResolvedValueOnce(null);
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        text: 'mock-text',
        title: 'mock-title',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const publication = service.create(dto);
      expect(publication).rejects.toThrow(new NotFoundException());
    });

    it('should throw not found error when post does not exist', () => {
      jest.spyOn(mediasRepository, 'findById').mockResolvedValueOnce({
        id: 1,
        title: 'mock-title',
        username: 'mock-username',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      const publication = service.create(dto);
      expect(publication).rejects.toThrow(new NotFoundException());
    });
  });

  describe('Update publication', () => {
    it('should create expected publication', async () => {
      const serverResponse = {
        id: 1,
        mediaId: 1,
        postId: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(mediasRepository, 'findById').mockResolvedValueOnce({
        id: 1,
        title: 'mock-title',
        username: 'mock-username',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        text: 'mock-text',
        title: 'mock-title',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        mediaId: 1,
        postId: 1,
        date: dto.date,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(repository, 'update').mockResolvedValueOnce(serverResponse);

      const publication = await service.update(1, dto);
      expect(publication).toEqual(serverResponse);
    });

    it('should throw forbidden error when publication is published', () => {
      jest.spyOn(mediasRepository, 'findById').mockResolvedValueOnce({
        id: 1,
        title: 'mock-title',
        username: 'mock-username',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        text: 'mock-text',
        title: 'mock-title',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
        id: 1,
        mediaId: 1,
        postId: 1,
        date: new Date('1990-05-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const publication = service.update(1, dto);
      expect(publication).rejects.toThrow(new ForbiddenException());
    });
  });

  describe('Delete publication', () => {
    it('should delete expected publication', async () => {
      jest.spyOn(repository, 'remove').mockResolvedValueOnce({
        id: 1,
        mediaId: 1,
        postId: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const publication = await service.remove(1);
      expect(publication).toEqual('Publication 1 deleted');
    });

    it('should throw not found if publication does not exist', () => {
      jest.spyOn(repository, 'remove').mockRejectedValueOnce({ code: 'P2025' });
      const publication = service.remove(1);
      expect(publication).rejects.toThrow(new NotFoundException());
    });
  });
});
