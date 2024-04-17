import { randomString } from '../utils/randomString';

export const fakePost = (): { title: string; alias: string; content: string } => {
  const rand = randomString(10);

  return {
    title: `Post title ${rand}`,
    alias: `post-title-${rand.toLowerCase()}`,
    content: '<p>Post content</p>',
  };
};
