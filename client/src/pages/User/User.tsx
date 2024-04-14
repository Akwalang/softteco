import { Main } from '../../layouts';
import { Toggle, SignIn, SignUp } from '../../components';

import styles from "./styles.module.scss";

export const User = () => {
  return (
    <Main title="Authorization">
      <div className={styles.root}>
        <div className={styles.image} />
        <div className={styles.form}>
          <Toggle
            items={['Sign in', 'Sign up']}
            views={[SignIn, SignUp]}
          />
        </div>
      </div>
    </Main>
  );
};
