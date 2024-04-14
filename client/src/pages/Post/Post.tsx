import { useParams } from 'react-router-dom';

import { Main } from '../../layouts';
import { PostItem, CommentsList } from '../../components';

import styles from "./styles.module.scss";

import { mock } from './mock';

export const Post = () => {
  const { alias } = useParams<{ alias: string }>();

  return (
    <Main title={mock.title}>
      <div className={styles.post}>
        <PostItem {...mock} />
      </div>
      <hr className={styles.separator} />
      <div className={styles.comments}>
        <CommentsList {...mock} />
      </div>
    </Main>
  );
};
