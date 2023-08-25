import { ConflictException, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';
import { MediasService } from './medias.service';

describe('MediasService', () => {
  let service: MediasService;
  let repository: MediasRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediasService, MediasRepository, PrismaService],
    }).compile();

    service = module.get<MediasService>(MediasService);
    repository = module.get<MediasRepository>(MediasRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Find all medias', () => {
    it('should return empty array', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([]);
      const medias = await service.findAll();
      expect(medias).toHaveLength(0);
    });

    it('should return all medias', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([
        {
          id: 1,
          title: 'mock-title',
          username: 'mock-username',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const medias = await service.findAll();
      expect(medias).toEqual([
        { id: 1, title: 'mock-title', username: 'mock-username' },
      ]);
    });
  });

  describe('Find one media', () => {
    it('should throw Not Found when id does not exist', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);
      const medias = service.findOne(1);
      expect(medias).rejects.toThrow(new NotFoundException());
    });

    it('should return a media', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce({
        id: 1,
        title: 'mock-title',
        username: 'mock-username',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const medias = await service.findOne(1);
      expect(medias).toEqual([
        { id: 1, title: 'mock-title', username: 'mock-username' },
      ]);
    });
  });

  describe('Create new media', () => {
    it('should create new media', async () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';
      const serviceResponse = {
        id: 1,
        title: dto.title,
        username: dto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findCombination').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockResolvedValueOnce(serviceResponse);

      const createdMedia = await service.create(dto);
      expect(createdMedia).toEqual(serviceResponse);
    });

    it('should throw conflict when combination is found', () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';
      const serviceResponse = {
        id: 1,
        title: dto.title,
        username: dto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findCombination')
        .mockResolvedValueOnce(serviceResponse);

      const createdMedia = service.create(dto);
      expect(createdMedia).rejects.toThrow(new ConflictException());
    });
  });

  describe('Update a media', () => {
    it('should update the media', async () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';
      const serviceResponse = {
        id: 1,
        title: dto.title,
        username: dto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findById').mockResolvedValueOnce(serviceResponse);
      jest.spyOn(repository, 'findCombination').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(serviceResponse);

      const updatedMedia = await service.update(1, dto);
      expect(updatedMedia).toEqual(serviceResponse);
    });

    it('should throw conflict when combination is found', () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';
      const serviceResponse = {
        id: 1,
        title: dto.title,
        username: dto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findById').mockResolvedValueOnce(serviceResponse);
      jest
        .spyOn(repository, 'findCombination')
        .mockResolvedValueOnce(serviceResponse);

      const updatedMedia = service.update(1, dto);
      expect(updatedMedia).rejects.toThrow(new ConflictException());
    });

    it('should throw not found when id does not exist', () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';

      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      const updatedMedia = service.update(1, dto);
      expect(updatedMedia).rejects.toThrow(new NotFoundException());
    });
  });

  describe('Delete a media', () => {
    it('should delete the media', async () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';
      const serviceResponse = {
        id: 1,
        title: dto.title,
        username: dto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findById').mockResolvedValueOnce(serviceResponse);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(serviceResponse);

      const deleteMedia = await service.remove(1);
      expect(deleteMedia).toEqual(`Media 1 deleted`);
    });

    it('should throw not found when id does not exist', () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      const deleteMedia = service.remove(1);
      expect(deleteMedia).rejects.toThrow(new NotFoundException());
    });

    it('should throw conflict when combination is found', () => {
      const dto = new CreateMediaDto();
      dto.title = 'mock-title';
      dto.username = 'mock-username';

      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      const updatedMedia = service.remove(1);
      expect(updatedMedia).rejects.toThrow(new NotFoundException());
    });

    //TODO: Implement prisma constraint
    it('should throw conflict when combination is found', () => {
      expect(true).toBe(true);
    });
  });
});
