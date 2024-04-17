import { useCallback, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { Main } from "../../layouts";
import { PostEditor } from "../../components";
import { Waiting } from "../../components";

import { usePost, usePostUpdate } from "../../hooks/usePosts";

import { IPostUpdate } from "../../interfaces/posts";
import styles from "../PostCreate/styles.module.scss";

export const PostUpdatePage = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);

  const { alias } = useParams<{ alias: string }>();

  const postQuery = usePost(alias!);

  const postUpdateMutation = usePostUpdate(postQuery.data?.id || "");
  const navigate = useNavigate();

  const onCancel = useCallback(() => {
    navigate(`/posts/${postQuery.data?.alias}`);
  }, [navigate, postQuery.data]);

  const onSubmit = useCallback(
    async (data: IPostUpdate) => {
      const result = await postUpdateMutation.mutateAsync(data);

      if ("error" in result) {
        setError(result.message);
      } else {
        navigate(`/`);
      }
    },
    [postUpdateMutation, navigate],
  );

  if (!postQuery.isSuccess) return <Waiting queries={[postQuery]} />;

  return (
    <Main title="Update post">
      {error && <div className={styles.errorText}>{error}</div>}
      <PostEditor post={postQuery.data} onSubmit={onSubmit} onCancel={onCancel} />
    </Main>
  );
};
