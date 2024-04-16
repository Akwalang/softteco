import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { UserEntity } from '../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (name: string) => {
              return {
                'jwt.secret': 'secret',
                'jwt.expiresIn': '1d',
              }[name];
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUserByLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService) as AuthService;
    jwtService = module.get<JwtService>(JwtService) as JwtService;
    userService = module.get<UserService>(UserService) as UserService;
  });

  describe('getTokenData', () => {
    it('should return user data from token', async () => {
      // prettier-ignore
      const tokenValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzEwLCJleHAiOjIwMjg2Mjk3MTB9.zAAleIoLcTgzONusbxSBgbGQES8_RobbGTQOawy1VHg';

      const expectedResult = {
        isAuthorized: true,
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
      };

      const result = await service.getTokenData(tokenValid);

      expect(result).toEqual(expectedResult);
    });

    it(`should return isAuthorized false when user has outdated token`, async () => {
      // prettier-ignore
      const tokenOutdated = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzcwLCJleHAiOjE3MTMyNjk3NzF9.4K4t0slDcin9MaiBG8toF15f0yvuxAcLbY-IUMH_4dg';

      const expectedResult = { isAuthorized: false };

      const result = await service.getTokenData(tokenOutdated);

      expect(result).toEqual(expectedResult);
    });

    it(`should return isAuthorized false when user hasn't token`, async () => {
      const expectedResult = { isAuthorized: false };

      const result = await service.getTokenData('');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('signUp', () => {
    it('should call user creation and return auth status', async () => {
      const token = 'token';

      const signUpData = {
        name: 'Alexi',
        email: 'alexi@gmail.com',
        password: 'password',
      };

      const expectedResult = {
        isAuthorized: true,
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        token,
      };

      const userRecord = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        email: 'alexi@user.com',
        password: '$2a$10$ZRvyPJrtn0vzpnXyzLA0OeO4W9HK8W11nwzWe99fJZbSslg4sRJdW',
        createdAt: '2024-04-16T07:51:51.108Z',
        updatedAt: '2024-04-16T07:51:51.108Z',
      } as UserEntity;

      jest.spyOn(userService, 'createUser').mockReturnValue(Promise.resolve(userRecord));
      jest.spyOn(service as any, 'generateToken').mockResolvedValue(token);

      const result = await service.signUp(signUpData);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('signIn', () => {
    it('should call user login and return auth status', async () => {
      const token = 'token';

      const signInData = {
        email: 'alexi@gmail.com',
        password: 'password',
      };

      const expectedResult = {
        isAuthorized: true,
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        token,
      };

      const userRecord = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        email: 'alexi@user.com',
        password: '$2a$10$ZRvyPJrtn0vzpnXyzLA0OeO4W9HK8W11nwzWe99fJZbSslg4sRJdW',
        createdAt: '2024-04-16T07:51:51.108Z',
        updatedAt: '2024-04-16T07:51:51.108Z',
      } as UserEntity;

      jest
        .spyOn(userService, 'getUserByLogin')
        .mockReturnValue(Promise.resolve(userRecord));
      jest.spyOn(service as any, 'generateToken').mockResolvedValue(token);

      const result = await service.signIn(signInData);

      expect(result).toEqual(expectedResult);
    });

    it('should call user login and return isAuthorized false when user not exists', async () => {
      const signInData = {
        email: 'alexi@gmail.com',
        password: 'password',
      };

      const expectedResult = { isAuthorized: false };

      jest.spyOn(userService, 'getUserByLogin').mockReturnValue(Promise.resolve(null));

      const result = await service.signIn(signInData);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('parseToken', () => {
    it('should extract user data from token', async () => {
      // prettier-ignore
      const tokenValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzEwLCJleHAiOjIwMjg2Mjk3MTB9.zAAleIoLcTgzONusbxSBgbGQES8_RobbGTQOawy1VHg';

      const expectedResult = {
        userId: '00000000-0000-0000-0000-000000000001',
        userName: 'Alexi',
      };

      const result = await (service as any).parseToken(tokenValid);

      expect(result).toEqual(expectedResult);
    });

    it('should return null in case of outdated token', async () => {
      // prettier-ignore
      const tokenOutdated = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1c2VyTmFtZSI6IkFsZXhpIiwiaWF0IjoxNzEzMjY5NzcwLCJleHAiOjE3MTMyNjk3NzF9.4K4t0slDcin9MaiBG8toF15f0yvuxAcLbY-IUMH_4dg';

      const expectedResult = null;

      const result = await (service as any).parseToken(tokenOutdated);

      expect(result).toEqual(expectedResult);
    });

    it('should return null in case of empty token', async () => {
      const expectedResult = null;

      const result = await (service as any).parseToken('');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('generateToken', () => {
    it('should generate a new token', async () => {
      const userRecord = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Alexi',
        email: 'alexi@user.com',
        password: '$2a$10$ZRvyPJrtn0vzpnXyzLA0OeO4W9HK8W11nwzWe99fJZbSslg4sRJdW',
        createdAt: '2024-04-16T07:51:51.108Z',
        updatedAt: '2024-04-16T07:51:51.108Z',
      } as UserEntity;

      const result = await (service as any).generateToken(userRecord);

      expect(typeof result).toEqual('string');
      expect(result.split('.').length).toEqual(3);
    });
  });
});
