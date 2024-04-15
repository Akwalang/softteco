import { API_URL } from '../settings';
import { request } from '../utils/request';

import { IComment, ICommentCreate, ICommentUpdate } from '../interfaces/comments';

export const createComment = (postId: string, comment: ICommentCreate): Promise<IComment> => {
  return request<IComment>(`${API_URL}/posts/${postId}/comments`, 'POST', comment);
};

export const updateComment = (postId: string, commentId: string, comment: ICommentUpdate): Promise<IComment> => {
  return request<IComment>(`${API_URL}/posts/${postId}/comments/${commentId}`, 'PATCH', comment);
};

export const deleteComment = (postId: string, commentId: string): Promise<IComment> => {
  return request<IComment>(`${API_URL}/posts/${postId}/comments/${commentId}`, 'DELETE');
};
