import { randomString } from '../utils/randomString';

export const fakeUser = (): { name: string; email: string; password: string } => {
  const rand = randomString(10);

  return {
    name: `User name ${rand}`,
    email: `test-user-${rand.toLowerCase()}@example.com`,
    password: 'password',
  };
};
