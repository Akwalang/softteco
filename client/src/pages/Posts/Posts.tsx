import { Link } from "react-router-dom";

import { Main } from "../../layouts";
import { Waiting, PostsList } from "../../components";

import { useMe } from "../../hooks/useAuth";
import { usePostsList } from "../../hooks/usePosts";

import styles from "./styles.module.scss";

export const PostsPage = (): JSX.Element => {
  const userQuery = useMe();
  const postsQuery = usePostsList();

  if (!userQuery.isSuccess && !postsQuery.isSuccess) {
    return <Waiting queries={[userQuery, postsQuery]} />;
  }

  return (
    <Main title="Articles">
      {userQuery.data?.isAuthorized && (
        <div className={styles.controls}>
          <Link className={styles.button} to="/editor/new">
            Create new post
          </Link>
        </div>
      )}
      <PostsList posts={postsQuery.data || []} />
    </Main>
  );
};
