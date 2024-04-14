import styles from './styles.module.scss';

interface ICommentsProps {
  id: string;
  createdAt: string;
  message: string;
  author: {
    id: string;
    name: string;
  };
}

export const Comment = (props: ICommentsProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={styles.author}>Author: {props.author.name}</div>
      <div className={styles.date}>Date: {props.createdAt}</div>
      <div className={styles.message}>{props.message}</div>
    </div>
  );
};
