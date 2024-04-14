import React from 'react';

import { Navigation } from '../../components';

import styles from './styles.module.scss';

interface IMainProps {
  title: string;
  children: React.ReactNode;
}

export const Main = (props: IMainProps): JSX.Element => {
  const { title, children } = props;

  return (
    <>
      <div className={styles.topLine}>
        <Navigation />
      </div>
      <div className={styles.bodyWrapper}>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  );
};
