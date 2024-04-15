import { useCallback, useState } from 'react';

import { CommentEditor } from '../CommentEditor/CommentEditor';

import { useQueryStore } from '../../hooks/useQueryStore';
import { useCommentsUpdate, useCommentsDelete } from '../../hooks/useComments';

import { formatDate } from '../../utils/formatDate';

import styles from './styles.module.scss';

interface ICommentsProps {
  post: {
    id: string;
    alias: string;
  };
  comment: {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      name: string;
    };
  };
}

export const Comment = ({ post, comment }: ICommentsProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const user = useQueryStore(['auth']);

  const commentUpdateMutation = useCommentsUpdate(post.id, post.alias, comment.id);
  const commentDeleteMutation = useCommentsDelete(post.id, post.alias, comment.id);

  const isAuthor = user?.id === comment.author.id;

  const onUpdate = useCallback((data) => {
    commentUpdateMutation.mutate(data);
    setIsEditing(false);
  }, [commentUpdateMutation]);

  const onCancel = useCallback(() => setIsEditing(false), []);

  return (
    <div className={styles.root}>
      <div className={styles.author}>Author: {comment.author.name}</div>
      <div className={styles.date}>Date: {formatDate(comment.createdAt)}</div>
      {isEditing && <CommentEditor value={comment.message} onSubmit={onUpdate} onCancel={onCancel} />}
      {
        !isEditing &&
        <>
          <div className={styles.message} dangerouslySetInnerHTML={{ __html: comment.message }} />
          {comment.createdAt !== comment.updatedAt && <div className={styles.updated}>Updated: {formatDate(comment.updatedAt)}</div>}
          {
            isAuthor &&
            <div className={styles.controls}>
              <span className={styles.button} onClick={() => setIsEditing(true)}>Edit</span>
              <span className={styles.button} onClick={() => commentDeleteMutation.mutate()}>Delete</span>
            </div>
          }
        </>
      }
    </div>
  );
};
