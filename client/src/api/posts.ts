import { API_URL } from '../settings';
import { request } from '../utils/request';

import { IPostListItem, IPost, IPostCreate, IPostUpdate } from '../interfaces/posts';

export const getPosts = (): Promise<IPostListItem[]> => {
  return request<IPostListItem[]>(`${API_URL}/posts`);
};

export const getPost = (id: string): Promise<IPost> => {
  return request<IPost>(`${API_URL}/posts/${id}`);
};

export const createPost = (post: IPostCreate): Promise<IPost> => {
  return request<IPost>(`${API_URL}/posts`, 'POST', post);
};

export const updatePost = (id: string, post: IPostUpdate): Promise<IPost> => {
  return request<IPost>(`${API_URL}/posts/${id}`, 'PATCH', post);
};

export const deletePost = (id: string): Promise<IPost> => {
  return request<IPost>(`${API_URL}/posts/${id}`, 'DELETE');
};
