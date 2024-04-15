import styles from './styles.module.scss';

export const Loader = (): JSX.Element => {
  return (
    <div className={styles.root}>
      <span className={styles.loader} />
    </div>);
}

