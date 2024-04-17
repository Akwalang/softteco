import { randomString } from '../utils/randomString';

export const fakeComment = (): { message: string } => {
  const rand = randomString(10);

  return {
    message: `Comment content <b>${rand}</b>`,
  };
};
