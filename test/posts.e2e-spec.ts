import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PostsModule } from '../src/posts/posts.module';
import { PostsFactory } from './factories/posts.factory';
import { PublicationsFactory } from './factories/publications.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  const validBody = { title: 'LinkedIn', text: 'https://www.linkedin.com' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule, PrismaModule],
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

  describe('GET /posts', () => {
    it('should return array of posts in database', async () => {
      //setup
      const numberOfPosts = 2;
      for (let i = 0; i < numberOfPosts; i++) {
        await PostsFactory.build(prisma);
      }

      const response = await request(app.getHttpServer()).get('/posts');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(numberOfPosts);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        image: expect.any(String),
      });
    });

    it('should return empty array when no post in database', async () => {
      const response = await request(app.getHttpServer()).get('/posts');
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return the expected post object', async () => {
      //setup
      const { id, title, text, image } = await PostsFactory.build(prisma);

      const response = await request(app.getHttpServer()).get(`/posts/${id}`);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual([{ id, title, text, image }]);
    });

    it("should result 404 if id doesn't exist", async () => {
      //setup
      const response = await request(app.getHttpServer()).get(`/posts/100`);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should result 400 if id isn't a valid number", async () => {
      //setup
      const response = await request(app.getHttpServer()).get(`/posts/A`);
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /posts', () => {
    it('should return register a new posts', async () => {
      const response = await request(app.getHttpServer())
        .post(`/posts`)
        .send(validBody);
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        title: validBody.title,
        text: validBody.text,
      });
    });

    it('should result in 400 error when body is not valid', async () => {
      const response = await request(app.getHttpServer()).post('/posts').send();
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[0]).toEqual('title should not be empty');
    });
  });

  describe('PUT /posts', () => {
    it('should return edit the existing post', async () => {
      //setup
      const { id } = await PostsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/posts/${id}`)
        .send(validBody);
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          title: validBody.title,
          text: validBody.text,
        },
      ]);
    });

    it('should result in 400 error when body is not valid', async () => {
      //setup
      const { id } = await PostsFactory.build(prisma);

      const response = await request(app.getHttpServer())
        .put(`/posts/${id}`)
        .send();
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toHaveLength(4);
      expect(response.body.message[0]).toEqual('title should not be empty');
    });

    it('should result in 404 error when id does not exist', async () => {
      return request(app.getHttpServer())
        .put(`/posts/100`)
        .send(validBody)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /posts', () => {
    it('should delete given id', async () => {
      //setup
      const { id } = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/posts/${id}`)
        .expect(HttpStatus.OK);
    });

    it('should result in 404 when given id does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/1`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should result in 403 when post belongs to a publication', async () => {
      //setup
      const { postId } = await PublicationsFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
