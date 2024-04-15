import { Comment } from '../Comment/Comment';

import styles from './styles.module.scss';

interface ICommentsListProps {
  post: {
    id: string;
    alias: string;
  };
  comments: {
    id: string;
    createdAt: string;
    message: string;
    author: {
      id: string;
      name: string;
    };
  }[];
}

export const CommentsList = (props: ICommentsListProps): JSX.Element => {
  const { post, comments } = props;

  return (
    <div className={styles.root}>
      <div className={styles.title}>Comments</div>
      <div className={styles.comments}>
        {comments.map((item) => <Comment key={item.id} post={post} comment={item} />)}
      </div>
    </div>
  );
};
