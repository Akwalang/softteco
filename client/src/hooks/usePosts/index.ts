import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';

import * as Posts from '../../api/posts';

import { IPostListItem, IPost, IPostCreate, IPostUpdate } from '../../interfaces/posts';
import { IError } from '../../interfaces/error';

export const usePostsList = (): UseQueryResult<IPostListItem[], Error> => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => Posts.getPosts(),
  });
};

export const usePost = (alias: string): UseQueryResult<IPost, Error> => {
  return useQuery({
    queryKey: ['post', alias],
    queryFn: () => Posts.getPost(alias),
  });
};

export const usePostCreate = (): UseMutationResult<IPost | IError, unknown, IPostCreate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPostCreate) => Posts.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePostUpdate = (postId: string): UseMutationResult<IPost | IError, unknown, IPostUpdate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPostUpdate) => Posts.updatePost(postId, post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', data.alias] });
    },
  });
};

export const usePostDelete = (postId: string): UseMutationResult<IPost, unknown, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Posts.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
