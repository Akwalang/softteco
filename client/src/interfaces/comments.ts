export interface IComment {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface ICommentCreate {
  message: string;
}

export interface ICommentUpdate {
  message: string;
}
