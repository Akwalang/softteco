import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AUTH_COOKIE_NAME, COOKIE_SETTINGS } from './constants';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getTokenData: jest.fn(),
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController) as AuthController;
    service = module.get<AuthService>(AuthService) as AuthService;
  });

  describe('me', () => {
    it('should delete comment by its id', async () => {
      const token = 'token';

      const request = {
        cookies: {
          [AUTH_COOKIE_NAME]: token,
        },
      } as Request;

      await controller.me(request);

      expect(service.getTokenData).toBeCalledWith(token);
    });
  });

  describe('signUp', () => {
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    const signUpData = {
      name: 'Alexi',
      email: 'alexi@gmail.com',
      password: 'password',
    };

    it('should call new user creation and setup cookie', async () => {
      const token = 'token';

      const signUpResult = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        isAuthorized: true as const,
        token,
      };

      const expectedResult = {
        isAuthorized: true,
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
      };

      jest.spyOn(service, 'signUp').mockResolvedValue(Promise.resolve(signUpResult));

      const result = await controller.signUp(response, signUpData);

      expect(result).toEqual(expectedResult);
      expect(response.cookie).toBeCalledWith(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);
    });
  });

  describe('signIn', () => {
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    const signInData = {
      email: 'alexi@gmail.com',
      password: 'password',
    };

    it('should call user sign in and setup cookie', async () => {
      const token = 'token';

      const signInResult = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        isAuthorized: true as const,
        token,
      };

      const expectedResult = {
        isAuthorized: true,
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
      };

      jest.spyOn(service, 'signIn').mockResolvedValue(Promise.resolve(signInResult));

      const result = await controller.signIn(response, signInData);

      expect(result).toEqual(expectedResult);
      expect(response.cookie).toBeCalledWith(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);
    });
  });

  describe('signOut', () => {
    const response = {
      clearCookie: jest.fn(),
    } as unknown as Response;

    it('should clear user cookie', async () => {
      const expectedResult = { isAuthorized: false };

      const result = await controller.signOut(response);

      expect(result).toEqual(expectedResult);
      expect(response.clearCookie).toBeCalledWith(AUTH_COOKIE_NAME, COOKIE_SETTINGS);
    });
  });
});
