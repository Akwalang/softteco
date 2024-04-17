import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const getSignCookie = async (
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> => {
  const response = await request(app.getHttpServer()).post('/auth/sign-in').send({
    email,
    password,
  });

  const cookie = response.headers['set-cookie'];

  const [token] = /accessToken=([^;]+);/.exec(cookie) || [, ''];

  return token;
};
