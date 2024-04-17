import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import * as cookieParser from 'cookie-parser';
import { Agent } from 'supertest';

import { AppModule } from '../src/application/app.module';

import { PostEntity } from '../src/application/posts/entities/post.entity';

import { createAgents } from './utils/createAgents';
import { fakePost } from './fakers/post';

import { USER_1_ID } from './constants/creadentials';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  let agentUnsigned: Agent;
  let agentAuthor: Agent;
  let agentOther: Agent;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    entityManager = moduleFixture.get(EntityManager);

    [agentUnsigned, agentAuthor, agentOther] = await createAgents(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get all posts: [GET] /posts/', async () => {
    const response = await agentUnsigned.get('/posts').send();

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Create new post from unsigned user: [post] /posts/', async () => {
    const response = await agentUnsigned.post('/posts').send(fakePost());

    expect(response.statusCode).toBe(401);
  });

  it('Create new post from signed user: [post] /posts/', async () => {
    const post = fakePost();
    const response = await agentAuthor.post('/posts').send(post);

    const { title, alias, content } = response.body;

    expect(response.statusCode).toBe(201);
    expect({ title, alias, content }).toEqual(post);

    await entityManager.delete(PostEntity, { id: response.body.id });
  });

  it('Update post from author: [patch] /posts/:id', async () => {
    const initPost = fakePost();
    const updatePost = fakePost();

    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const response = await agentAuthor.patch(`/posts/${post.id}`).send(updatePost);

    const { title, alias, content, author } = response.body;

    expect(response.statusCode).toBe(200);
    expect({ title, alias, content, author }).toEqual(updatePost);

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Update post from not author: [patch] /posts/:id', async () => {
    const initPost = fakePost();
    const updatePost = fakePost();

    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const response = await agentOther.patch(`/posts/${post.id}`).send(updatePost);

    expect(response.statusCode).toBe(400);

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Delete post from author: [delete] /posts/:id', async () => {
    const initPost = fakePost();

    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const response = await agentAuthor.delete(`/posts/${post.id}`).send();

    const { title, alias, content } = response.body;

    expect(response.statusCode).toBe(200);

    expect({ title, alias, content }).toEqual(initPost);

    const record = await entityManager.findOneBy(PostEntity, { id: post.id });

    expect(record).toBeNull();
  });

  it('Delete post from not author: [delete] /posts/:id', async () => {
    const initPost = fakePost();

    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const response = await agentOther.delete(`/posts/${post.id}`).send();

    expect(response.statusCode).toBe(400);

    await entityManager.delete(PostEntity, { id: post.id });
  });
});
