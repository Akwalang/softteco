import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface IPost {
  id: string;
  createdAt: string;
  title: string;
  alias: string;
  author: {
    id: string;
    name: string;
  };
}

interface IPostsListProps {
  posts: IPost[];
}

const Post = (props: IPost) => {
  return (
    <li className={styles.item}>
      <Link to={`/posts/${props.alias}`} className={styles.link}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.author}>Author: {props.author.name}</div>
        <div className={styles.date}>Date: {props.author.name}</div>
      </Link>
    </li>
  );
};

export const PostsList = (props: IPostsListProps) => {
  const { posts } = props;

  return (
    <ul className={styles.root}>
      {posts.map((item) => <Post key={item.id} {...item} />)}
    </ul>
  );
};
