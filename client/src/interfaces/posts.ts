import { IComment } from './comments';

export interface IAuthor {
  id: string;
  name: string;
}

export interface IPostListItem {
  id: string;
  title: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  author: IAuthor;
}

export interface IPost {
  id: string;
  title: string;
  alias: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: IComment[];
  author: IAuthor;
}

export interface IPostCreate {
  title: string;
  alias: string;
  content: string;
}

export interface IPostUpdate {
  title: string;
  alias: string;
  content: string;
}
