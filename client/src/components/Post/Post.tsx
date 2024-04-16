import { useNavigate } from 'react-router';

import { usePostDelete } from '../../hooks/usePosts';
import { formatDate } from '../../utils/formatDate';

import { IAuthUser } from '../../interfaces/auth';
import { IPost } from '../../interfaces/posts';

import styles from './styles.module.scss';

interface IPostProps {
  post: IPost;
  user: IAuthUser;
}

export const Post = ({ post, user }: IPostProps): JSX.Element => {
  const navigate = useNavigate();

  const postDeleteMutation = usePostDelete(post.id);

  const isAuthor = user?.id === post.author.id;

  const onEdit = () => navigate(`/editor/update/${post.alias}`);

  const onDelete = async () => {
    await postDeleteMutation.mutateAsync();
    navigate(`/`)
  };

  return (
    <div className={styles.root}>
      <div className={styles.author}>Author: {post.author.name}</div>
      <div className={styles.date}>Date: {formatDate(post.createdAt)}</div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className={styles.controls}>
        {
          isAuthor &&
          <div className={styles.controls}>
            <div className={styles.button} onClick={onEdit}>Edit</div>
            <div className={styles.button} onClick={onDelete}>Delete</div>
          </div>
        }
      </div>
    </div>
  );
}
