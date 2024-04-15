export interface IAuthSignIn {
  email: string;
  password: string;
}

export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  isAuthorized: boolean;
}
