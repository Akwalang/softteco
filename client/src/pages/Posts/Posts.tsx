import { Main } from '../../layouts';
import { PostsList } from '../../components';

import styles from "./styles.module.scss";

import { mock } from './mock';

export const Posts = () => {
  return (
    <Main title="Articles">
      <PostsList posts={mock} />
    </Main>
  );
};
