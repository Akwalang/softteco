import { API_URL } from '../settings';
import { request } from '../utils/request';

import { IAuthSignIn, IAuthSignUp, IAuthUser } from '../interfaces/auth';

export const me = (): Promise<IAuthUser> => {
  return request<IAuthUser>(`${API_URL}/auth/me`);
};

export const signIn = (data: IAuthSignIn): Promise<IAuthUser> => {
  return request<IAuthUser>(`${API_URL}/auth/sign-in`, 'POST', data);
}

export const signUp = (data: IAuthSignUp): Promise<IAuthUser> => {
  return request<IAuthUser>(`${API_URL}/auth/sign-up`, 'POST', data);
};

export const signOut = (): Promise<IAuthUser> => {
  return request<IAuthUser>(`${API_URL}/auth/sign-out`, 'POST');
};
