import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as Auth from '../../api/auth';

import { IAuthSignIn, IAuthSignUp } from '../../interfaces/auth';

type QueryResult = ReturnType<typeof useQuery>;
type MutationResult = ReturnType<typeof useMutation>;

export const useMe = (): QueryResult => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => Auth.me(),
  });
};

export const useSignIn = (): MutationResult => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAuthSignIn) => Auth.signIn(data),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useSignUp = (): MutationResult => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAuthSignUp) => Auth.signUp(data),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useSignOut = (): MutationResult => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Auth.signOut(),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};
