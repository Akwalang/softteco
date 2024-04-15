export interface IPostListItem {
  id: string;
  authorId: string;
  title: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  id: string;
  title: string;
  alias: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: unknown;
  author: unknown;
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
