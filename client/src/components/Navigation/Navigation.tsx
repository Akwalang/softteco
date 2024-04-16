import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export const Navigation = (): JSX.Element => {
  return (
    <div className={styles.root}>
      <ul className={styles.menu}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/user">User</Link>
        </li>
      </ul>
    </div>
  );
};
