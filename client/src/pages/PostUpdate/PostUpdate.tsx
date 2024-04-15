import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from "react-router-dom";

import { Main } from '../../layouts';
import { PostEditor } from '../../components';

import { Waiting } from '../../components';

import { usePost, usePostUpdate } from '../../hooks/usePosts';

export const PostUpdatePage = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);

  const { alias } = useParams<{ alias: string }>('alias');

  const postQuery = usePost(alias);

  const postUpdateMutation = usePostUpdate(postQuery.data?.id);
  const navigate = useNavigate();

  const onCancel = useCallback(() => {
    navigate(`/posts/${postQuery.data?.alias}`);
  }, [navigate, postQuery.data]);

  const onSubmit = useCallback(async (data) => {
    const result = await postUpdateMutation.mutateAsync(data);
    result?.error ? setError(result.message) : navigate(`/posts/${data.alias}`);
  }, [postUpdateMutation, navigate]);

  if (!postQuery.isSuccess) return <Waiting queries={[postQuery]} />;

  return (
    <Main title="Update post">
      <PostEditor post={postQuery.data} onSubmit={onSubmit} onCancel={onCancel} />
    </Main>
  );
};
