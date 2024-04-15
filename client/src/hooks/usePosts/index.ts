import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as Posts from '../../api/posts';

import { IPostCreate, IPostUpdate } from '../../interfaces/posts';

type Result = ReturnType<typeof useQuery>;

export const usePostsList = (): Result => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => Posts.getPosts(),
  });
};

export const usePost = (alias: string): Result => {
  return useQuery({
    queryKey: ['post', alias],
    queryFn: () => Posts.getPost(alias),
  });
};

export const usePostCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPostCreate) => Posts.createPost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePostUpdate = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPostUpdate) => Posts.updatePost(postId, post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', data.alias] });
    },
  });
};

export const usePostDelete = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Posts.deletePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
