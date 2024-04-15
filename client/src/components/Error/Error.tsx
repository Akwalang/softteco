import styles from './styles.module.scss';

export const Error = (): JSX.Element => {
  return (
    <div className={styles.root}>
      Error: Can't load data
    </div>
  );
}
