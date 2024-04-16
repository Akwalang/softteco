import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Comments from '../../api/comments';

import { ICommentCreate, ICommentUpdate } from '../../interfaces/comments';

export const useCommentsCreate = (postId: string, postAlias: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: ICommentCreate) => Comments.createComment(postId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postAlias] });
    },
  });
};

export const useCommentsUpdate = (postId: string, postAlias: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: ICommentUpdate) => Comments.updateComment(postId, commentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postAlias] });
    },
  });
};

export const useCommentsDelete = (postId: string, postAlias: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Comments.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postAlias] });
    },
  });
};
