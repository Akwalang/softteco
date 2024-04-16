import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import { Main } from '../../layouts';
import { PostEditor } from '../../components';

import { usePostCreate } from '../../hooks/usePosts';

import { IPostCreate } from '../../interfaces/posts';

import styles from './styles.module.scss';

export const PostCreatePage = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);

  const postCreateMutation = usePostCreate();
  const navigate = useNavigate();

  const onSubmit = useCallback(async (data: IPostCreate) => {
    const result = await postCreateMutation.mutateAsync(data);

    if ('error' in result) {
      setError(result.message)
    } else {
      navigate(`/posts/${data.alias}`)
    }
  }, [postCreateMutation, navigate, setError]);

  return (
    <Main title="Create new post">
      {error && <div className={styles.errorText}>{error}</div>}
      <PostEditor onSubmit={onSubmit} />
    </Main>
  );
};
