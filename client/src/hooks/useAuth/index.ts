import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';

import * as Auth from '../../api/auth';

import { IAuthSignIn, IAuthSignUp, IAuthUser } from '../../interfaces/auth';

export const useMe = (): UseQueryResult<IAuthUser, Error> => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: (): Promise<IAuthUser> => Auth.me(),
  });
};

export const useSignIn = (): UseMutationResult<IAuthUser, unknown, IAuthSignIn, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAuthSignIn) => Auth.signIn(data),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useSignUp = (): UseMutationResult<IAuthUser, unknown, IAuthSignUp, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAuthSignUp) => Auth.signUp(data),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useSignOut = (): UseMutationResult<IAuthUser, unknown, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Auth.signOut(),
    onSuccess: async (data) => {
      queryClient.setQueryData(['auth'], data);
      return queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};
