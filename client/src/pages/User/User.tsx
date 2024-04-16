import { Main } from '../../layouts';
import { Waiting, Toggle, SignIn, SignUp, SignOut } from '../../components';

import { useMe } from '../../hooks/useAuth';

import styles from "./styles.module.scss";

export const UserPage = () => {
  const userQuery = useMe();

  const user = userQuery.data;

  return (
    <Main title="Authorization">
      <Waiting queries={[userQuery]}>
        <div className={styles.root}>
          <div className={styles.image} />
          {
            user?.isAuthorized &&
            <div className={styles.action}>
              <SignOut user={user} />
            </div>
          }
          {
            (!user || !user.isAuthorized) &&
            <div className={styles.action}>
              <Toggle
                items={['Sign in', 'Sign up']}
                views={[SignIn, SignUp]}
              />
            </div>
          }
        </div>
      </Waiting>
    </Main>
  );
};
