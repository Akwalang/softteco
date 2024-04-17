import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import * as cookieParser from 'cookie-parser';
import { Agent } from 'supertest';

import { AppModule } from '../src/application/app.module';

import { PostEntity } from '../src/application/posts/entities/post.entity';
import { CommentEntity } from '../src/application/comments/entities/comment.entity';

import { createAgents } from './utils/createAgents';
import { fakeComment } from './fakers/comment';
import { fakePost } from './fakers/post';

import { USER_1_ID, USER_1_NAME } from './constants/creadentials';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  let agentUnsigned: Agent;
  let agentAuthor: Agent;
  let agentOther: Agent;

  const now = Date.now();

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

  it('Create new comment from unsigned user: [post] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();

    const response = await agentUnsigned.post(`/posts/${post.id}/comments/`).send({
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    expect(response.statusCode).toBe(401);
  });

  it('Create new comment from signed user: [post] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();

    const response = await agentAuthor.post(`/posts/${post.id}/comments/`).send({
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(initComment.message);

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Update post from author: [patch] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();
    const updateComment = fakeComment();

    const comment = await entityManager.save(CommentEntity, {
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    const response = await agentAuthor
      .patch(`/posts/${post.id}/comments/${comment.id}`)
      .send({
        ...updateComment,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(updateComment.message);

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Update post from not author: [patch] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();
    const updateComment = fakeComment();

    const comment = await entityManager.save(CommentEntity, {
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    const response = await agentOther
      .patch(`/posts/${post.id}/comments/${comment.id}`)
      .send({
        ...updateComment,
      });

    expect(response.statusCode).toBe(400);

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Delete comment from author: [delete] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();

    const comment = await entityManager.save(CommentEntity, {
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    const response = await agentAuthor
      .delete(`/posts/${post.id}/comments/${comment.id}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(initComment.message);

    const record = await entityManager.findOneBy(CommentEntity, { id: comment.id });

    expect(record).toBeNull();

    await entityManager.delete(PostEntity, { id: post.id });
  });

  it('Delete comment from not author: [delete] /posts/:postId/comments/:commentId', async () => {
    const initPost = fakePost();
    const post = await entityManager.save(PostEntity, {
      ...initPost,
      authorId: USER_1_ID,
    });

    const initComment = fakeComment();
    const comment = await entityManager.save(CommentEntity, {
      ...initComment,
      postId: post.id,
      authorId: USER_1_ID,
    });

    const response = await agentOther
      .delete(`/posts/${post.id}/comments/${comment.id}`)
      .send();

    expect(response.statusCode).toBe(400);

    await entityManager.delete(PostEntity, { id: post.id });
  });
});
