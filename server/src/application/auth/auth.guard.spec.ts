import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AUTH_COOKIE_NAME } from './constants';

describe('AuthController', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (name: string) => {
              return {
                'jwt.secret': 'secret',
              }[name];
            },
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard) as AuthGuard;
  });

  describe('canActivate', () => {
    const createContext = (
      token: string | null,
    ): { context: ExecutionContext; request: Request } => {
      const cookies = { [AUTH_COOKIE_NAME]: token };
      const request = { cookies } as Request;

      if (!token) {
        delete request.cookies[AUTH_COOKIE_NAME];
      }

      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;

      return { context, request };
    };

    it('open route when token is valid', async () => {
      // prettier-ignore
      const tokenValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzEwLCJleHAiOjIwMjg2Mjk3MTB9.zAAleIoLcTgzONusbxSBgbGQES8_RobbGTQOawy1VHg';

      const user = {
        userId: '00000000-0000-0000-0000-000000000001',
        userName: 'Alexi',
      };

      const { context, request } = createContext(tokenValid);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(request['user']).toEqual(user);
    });

    it('close route when token is outdated', async () => {
      // prettier-ignore
      const tokenOutdated = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzcwLCJleHAiOjE3MTMyNjk3NzF9.4K4t0slDcin9MaiBG8toF15f0yvuxAcLbY-IUMH_4dg';

      const { context, request } = createContext(tokenOutdated);

      try {
        await guard.canActivate(context);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }

      expect(request['user']).toEqual(undefined);
    });

    it('close route when token is empty', async () => {
      const { context, request } = createContext(null);

      try {
        await guard.canActivate(context);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }

      expect(request['user']).toEqual(undefined);
    });
  });

  describe('getUserData', () => {
    const createRequest = (token: string | null): Request => {
      const cookies = { [AUTH_COOKIE_NAME]: token };
      const request = { cookies } as Request;

      if (!token) {
        delete request.cookies[AUTH_COOKIE_NAME];
      }

      return request;
    };

    it('return token data', async () => {
      // prettier-ignore
      const tokenValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzEwLCJleHAiOjIwMjg2Mjk3MTB9.zAAleIoLcTgzONusbxSBgbGQES8_RobbGTQOawy1VHg';

      const user = {
        userId: '00000000-0000-0000-0000-000000000001',
        userName: 'Alexi',
      };

      const request = createRequest(tokenValid);

      const result = await guard.getUserData(request);

      expect(result).toEqual(user);
    });

    it('throw an error when token is outdated', async () => {
      // prettier-ignore
      const tokenOutdated = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzcwLCJleHAiOjE3MTMyNjk3NzF9.4K4t0slDcin9MaiBG8toF15f0yvuxAcLbY-IUMH_4dg';

      const request = createRequest(tokenOutdated);

      try {
        await guard.getUserData(request);
        expect(true).toBe(false);
      } catch (error) {
        expect(true).toBe(true);
      }
    });

    it('throw an error when token is empty', async () => {
      const request = createRequest(null);

      try {
        await guard.getUserData(request);
        expect(true).toBe(false);
      } catch (error) {
        expect(true).toBe(true);
      }
    });
  });
});
