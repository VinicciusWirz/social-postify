import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PostsFactory } from './factories/posts.factory';
import { PublicationsModule } from '../src/publications/publications.module';
import { PublicationsFactory } from './factories/publications.factory';
import { MediasFactory } from './factories/media.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublicationsModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await prisma.publication.deleteMany();
    await prisma.media.deleteMany();
    await prisma.post.deleteMany();

    await app.init();
  });

  describe('GET /publications', () => {
    it('should return array of publications in database', async () => {
      //setup
      const numberOfPublications = 5;
      for (let i = 0; i < numberOfPublications; i++) {
        await PublicationsFactory.build(prisma);
      }

      const response = await request(app.getHttpServer()).get('/publications');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(numberOfPublications);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        mediaId: expect.any(Number),
        postId: expect.any(Number),
        date: expect.any(String),
      });
    });

    it('should return empty array when no publications exist in database', async () => {
      const response = await request(app.getHttpServer()).get('/publications');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(0);
    });

    it('should return array of published publications in database', async () => {
      //setup
      const published = await PublicationsFactory.build(prisma, true);
      const notPublished = await PublicationsFactory.build(prisma);

      const response = await request(app.getHttpServer()).get(
        '/publications?published=true',
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        id: published.id,
        mediaId: published.mediaId,
        postId: published.postId,
        date: expect.any(String),
      });
    });

    it('should return array of publications published in database after certain date', async () => {
      //setup
      const date = '2023-05-03';
      const publishedAfter = await PublicationsFactory.build(
        prisma,
        false,
        new Date('2023-05-05'),
      );
      const publishedBefore = await PublicationsFactory.build(
        prisma,
        false,
        new Date('2023-05-02'),
      );
      const notPublished = await PublicationsFactory.build(
        prisma,
        false,
        new Date('9999-05-02'),
      );

      const response = await request(app.getHttpServer()).get(
        `/publications?after=${date}`,
      );
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        id: publishedAfter.id,
        mediaId: publishedAfter.mediaId,
        postId: publishedAfter.postId,
        date: expect.any(String),
      });
    });

    it('should result 400 if after is not a valid date', async () => {
      //setup
      const date = 'Lorem ipsum';

      const response = await request(app.getHttpServer()).get(
        `/publications?after=${date}`,
      );
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /publications/:id', () => {
    it('should return the expected publication object', async () => {
      //setup
      const { id, mediaId, postId } = await PublicationsFactory.build(prisma);

      const response = await request(app.getHttpServer()).get(
        `/publications/${id}`,
      );
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id,
        mediaId,
        postId,
        date: expect.any(String),
      });
    });

    it("should result 404 if id doesn't exist", async () => {
      const response = await request(app.getHttpServer()).get(
        `/publications/1`,
      );
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should result 400 if id isn't a valid number", async () => {
      const response = await request(app.getHttpServer()).get(
        `/publications/A`,
      );
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /publications', () => {
    it('should register a new publication', async () => {
      //setup
      const { id: mediaId } = await MediasFactory.build(prisma);
      const { id: postId } = await PostsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .post(`/publications`)
        .send({ mediaId, postId, date: '2023-08-21T13:25:17.352Z' });
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        mediaId,
        postId,
        date: '2023-08-21T13:25:17.352Z',
      });
    });

    it('should result in 400 error when body is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/publications')
        .send();
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toHaveLength(6);
      expect(response.body.message[1]).toEqual('mediaId should not be empty');
    });

    it('should result in 404 error when reference is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/publications')
        .send({ mediaId: 1, postId: 1, date: '2023-08-21T13:25:17.352Z' });
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /publications', () => {
    it('should edit the existing publication', async () => {
      //setup
      const { id, mediaId, postId, date } =
        await PublicationsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/publications/${id}`)
        .send({ mediaId, postId, date });
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        mediaId,
        postId,
        date: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should result in 403 when editing a published publication', async () => {
      //setup
      const { id, mediaId, postId, date } = await PublicationsFactory.build(
        prisma,
        true,
      );

      const response = await request(app.getHttpServer())
        .put(`/publications/${id}`)
        .send({ mediaId, postId, date });
      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should result in 404 error when reference is not valid', async () => {
      //setup
      const { mediaId, postId } = await PublicationsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/publications/1`)
        .send({
          mediaId: mediaId,
          postId: postId,
          date: '2023-08-21T13:25:17.352Z',
        });
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should result in 404 error when reference in body is not valid', async () => {
      //setup
      const { id } = await PublicationsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/publications/${id}`)
        .send({ mediaId: 1, postId: 1, date: '2023-08-21T13:25:17.352Z' });
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /publications', () => {
    it('should delete given id', async () => {
      //setup
      const { id } = await PublicationsFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/publications/${id}`)
        .expect(HttpStatus.OK);
    });

    it('should result in 404 when given id does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/publications/1`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
