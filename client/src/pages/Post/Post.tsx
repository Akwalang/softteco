import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Main } from '../../layouts';
import { Waiting, Post, CommentsList, CommentEditor } from '../../components';

import { useMe } from '../../hooks/useAuth';
import { usePost } from '../../hooks/usePosts';
import { useCommentsCreate } from '../../hooks/useComments';

import styles from "./styles.module.scss";
import { ICommentCreate } from '../../interfaces/comments';

export const PostPage = (): JSX.Element => {
  const { alias } = useParams<{ alias: string }>();

  const userQuery = useMe();
  const postQuery = usePost(alias!);

  const commentCreateMutation = useCommentsCreate(postQuery.data?.id || '', alias!);

  const onCommentAdd = useCallback((data: ICommentCreate) => {
    commentCreateMutation.mutate(data);
  }, [commentCreateMutation]);

  if (!postQuery.isSuccess || !userQuery.isSuccess) {
    return <Waiting queries={[postQuery, userQuery]} />;
  }

  return (
    <Main title={postQuery.data?.title || ''}>
      <div className={styles.post}>
        <Post post={postQuery.data} user={userQuery.data} />
      </div>
      {
        postQuery.data.comments.length > 0 &&
        <>
          <hr className={styles.separator} />
          <div className={styles.comments}>
            <CommentsList post={postQuery.data} comments={postQuery.data?.comments || []} />
          </div>
        </>
      }
      {
        userQuery.data.isAuthorized &&
        <>
          <hr className={styles.separator} />
          <div className={styles.comments}>
            <CommentEditor title="Add comment" onSubmit={onCommentAdd} />
          </div>
        </>
      }
    </Main>
  );
};
