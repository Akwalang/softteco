import styles from './styles.module.scss';

interface IPostItemProps {
  createdAt: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
}

export const PostItem = (props: IPostItemProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={styles.author}>Author: {props.author.name}</div>
      <div className={styles.date}>Date: {props.createdAt}</div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: props.content }} />
    </div>
  );
}
