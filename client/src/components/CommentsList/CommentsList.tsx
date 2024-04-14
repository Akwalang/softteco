import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
import { Comment } from '../Comment/Comment';

interface ICommentsListProps {
  postId: string;
  comments: {
    id: string;
    createdAt: string;
    message: string;
    author: {
      id: string;
      name: string;
    };
  };
}

export const CommentsList = (props: ICommentsListProps): JSX.Element => {
  const { comments } = props;

  return (
    <div className={styles.root}>
      <div className={styles.title}>Comments</div>
      <div className={styles.comments}>
        {comments.map((item) => <Comment key={item.id} {...item} />)}
      </div>
    </div>
  );
};
