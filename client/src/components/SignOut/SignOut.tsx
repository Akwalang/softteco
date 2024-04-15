import styles from "./styles.module.scss";

import { useSignOut } from '../../hooks/useAuth';

import { IAuthUser } from '../../interfaces/auth';

interface ISignOutProps {
  user: IAuthUser;
}

export const SignOut = (props: ISignOutProps): JSX.Element => {
  const { user } = props;

  const authSignOutMutation = useSignOut();

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        User
      </div>
      <ul className={styles.user}>
        <li>Id: {user.id}</li>
        <li>Name: {user.name}</li>
      </ul>
      <div className={styles.action}>
        <span className={styles.button} onClick={() => authSignOutMutation.mutate()}>
          Sign out
        </span>
      </div>
    </div>
  );
};
