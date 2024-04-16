import { Comment } from '../Comment/Comment';

import { IPost } from '../../interfaces/posts';
import { IComment } from '../../interfaces/comments';

import styles from './styles.module.scss';

interface ICommentsListProps {
  post: IPost;
  comments: IComment[];
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
