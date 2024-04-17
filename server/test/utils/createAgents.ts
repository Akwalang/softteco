import { INestApplication } from '@nestjs/common';
import { agent, Agent } from 'supertest';

import { getSignCookie } from './getSignCookie';

import {
  USER_1_EMAIL,
  USER_1_PASSWORD,
  USER_2_EMAIL,
  USER_2_PASSWORD,
} from '../constants/creadentials';

export const createAgents = async (
  app: INestApplication,
): Promise<[Agent, Agent, Agent]> => {
  const unsigned = agent(app.getHttpServer());
  const signed_1 = agent(app.getHttpServer());
  const signed_2 = agent(app.getHttpServer());

  const cookie_1 = await getSignCookie(app, USER_1_EMAIL, USER_1_PASSWORD);
  const cookie_2 = await getSignCookie(app, USER_2_EMAIL, USER_2_PASSWORD);

  signed_1.jar.setCookie(cookie_1, '127.0.0.1', '/');
  signed_2.jar.setCookie(cookie_2, '127.0.0.1', '/');

  return [unsigned, signed_1, signed_2];
};
