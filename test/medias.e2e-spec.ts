import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MediasModule } from '../src/medias/medias.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { MediasFactory } from './factories/media.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const validBody = { title: 'LinkedIn', username: 'https://www.linkedin.com' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MediasModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = await moduleFixture.resolve(PrismaService);
    await prisma.publication.deleteMany();
    await prisma.post.deleteMany();
    await prisma.media.deleteMany();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('GET /medias', () => {
    it('should return array of medias in database', async () => {
      //setup
      const numberOfMedias = 2;
      for (let i = 0; i < numberOfMedias; i++) {
        await MediasFactory.build(prisma);
      }

      const response = await request(app.getHttpServer()).get('/medias');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(numberOfMedias);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        username: expect.any(String),
      });
    });

    it('should return empty array when no media in database', async () => {
      const response = await request(app.getHttpServer()).get('/medias');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /medias/:id', () => {
    it('should return the expected media object', async () => {
      //setup
      const { id, title, username } = await MediasFactory.build(prisma);

      const response = await request(app.getHttpServer()).get(`/medias/${id}`);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual([{ id, title, username }]);
    });

    it("should result 404 if id doesn't exist", async () => {
      //setup
      const response = await request(app.getHttpServer()).get(`/medias/100`);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should result 400 if id isn't a valid number", async () => {
      //setup
      const response = await request(app.getHttpServer()).get(`/medias/A`);
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /medias', () => {
    it('should return register a new media', async () => {
      const media = { title: 'LinkedIn', username: 'https://www.linkedin.com' };

      const response = await request(app.getHttpServer())
        .post(`/medias`)
        .send(media);
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        title: media.title,
        username: media.username,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should result in 400 error when body is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/medias')
        .send();
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[1]).toEqual('title should not be empty');
    });

    it('should result 409 error when title and username combination already exist', async () => {
      //setup
      const { title, username } = await MediasFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .post(`/medias`)
        .send({ title, username });
      expect(response.statusCode).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('PUT /medias', () => {
    it('should return edit the existing media', async () => {
      //setup
      const { id } = await MediasFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/medias/${id}`)
        .send(validBody);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        title: validBody.title,
        username: validBody.username,
      });
    });

    it('should result in 400 error when body is not valid', async () => {
      //setup
      const { id } = await MediasFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/medias/${id}`)
        .send();
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[1]).toEqual('title should not be empty');
    });

    it('should result in 404 error when id does not exist', async () => {
      return request(app.getHttpServer())
        .put(`/medias/100`)
        .send(validBody)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should result 409 error when title and username combination already exist', async () => {
      //setup
      const { id } = await MediasFactory.build(prisma);
      const { title, username } = await MediasFactory.build(prisma);

      return await request(app.getHttpServer())
        .post(`/medias/${id}`)
        .send({ title, username })
        .expect(HttpStatus.CONFLICT);
    });
  });

  //TODO: DELETE /medias
  describe('DELETE /medias', () => {});
});
