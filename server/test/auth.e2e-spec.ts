import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import { EntityManager } from 'typeorm';
import { Agent } from 'supertest';

import { AppModule } from '../src/application/app.module';

import { UserEntity } from '../src/application/user/entities/user.entity';

import { createAgents } from './utils/createAgents';
import { fakeUser } from './fakers/user';

import { bcrypt } from '../src/common/utils/bcrypt';
import { USER_1_ID, USER_1_NAME } from './constants/creadentials';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  let agentSigned: Agent;
  let agentUnsigned: Agent;

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

    [agentUnsigned, agentSigned] = await createAgents(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get user data error: [GET] /auth/me', async () => {
    const response = await agentUnsigned.get('/auth/me').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ isAuthorized: false });
  });

  it('Get user data success: [GET] /auth/me', async () => {
    const response = await agentSigned.get('/auth/me').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      isAuthorized: true,
      id: USER_1_ID,
      name: USER_1_NAME,
    });
  });

  it('Create a new user: [POST] /auth/sign-up', async () => {
    const initUser = fakeUser();

    const response = await agentUnsigned.post('/auth/sign-up').send(initUser);

    const { id, ...other } = response.body;

    expect(response.statusCode).toBe(201);
    expect(typeof id).toBe('string');
    expect(other).toEqual({ name: initUser.name, isAuthorized: true });

    await entityManager.delete(UserEntity, { id });
  });

  it('Sign in: [POST] /auth/sign-in', async () => {
    const initUser = fakeUser();

    const passwordHash = await bcrypt.hash(initUser.password);

    const user = await entityManager.save(UserEntity, {
      ...initUser,
      password: passwordHash,
    });

    const response = await agentUnsigned.post('/auth/sign-in').send({
      email: initUser.email,
      password: initUser.password,
    });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual({
      id: user.id,
      name: initUser.name,
      isAuthorized: true,
    });

    await entityManager.delete(UserEntity, { id: user.id });
  });

  it('Sign out: [POST] /auth/sign-in', async () => {
    const response = await agentUnsigned.post('/auth/sign-out').send();

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ isAuthorized: false });
  });
});
