import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager, QueryFailedError } from 'typeorm';

import { UserService } from './user.service';

import { UserEntity } from './entities/user.entity';

import { bcrypt } from '../../common/utils/bcrypt';

describe('UserService', () => {
  let service: UserService;
  let configService: ConfigService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: ConfigService,
          useValue: {
            get: (name: string) => {
              return {
                'auth.saltRounds': 10,
              }[name];
            },
          },
        },
        {
          provide: EntityManager,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService) as UserService;
    configService = module.get<ConfigService>(ConfigService) as ConfigService;
    entityManager = module.get<EntityManager>(EntityManager) as EntityManager;
  });

  describe('createUser', () => {
    const name = 'Alexi';
    const email = 'alexi@gmail.com';
    const password = 'password';

    const hash = '$2a$10$123456789012345678901uKv7';

    const userRecord = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alexi',
      email: 'alexi@gmail.com',
      password: hash,
      createdAt: '2024-04-16T07:51:51.108Z',
      updatedAt: '2024-04-16T07:51:51.108Z',
    } as UserEntity;

    it('should create new user and return his data', async () => {
      jest.spyOn(service as any, 'hashPassword').mockResolvedValue(hash);
      jest.spyOn(entityManager, 'save').mockImplementation(
        jest.fn(() => {
          return Promise.resolve({ ...userRecord });
        }),
      );

      const expectedArgument = {
        name: 'Alexi',
        email: 'alexi@gmail.com',
        password: hash,
      };

      const result = await service.createUser(name, email, password);

      expect(result).toEqual({ ...userRecord });
      expect(entityManager.save).toBeCalledWith(UserEntity, expectedArgument);
    });

    it('should create new user and return his data', async () => {
      const name = 'Alexi';
      const email = 'alexi@gmail.com';
      const password = 'password';

      const hash = '$2a$10$123456789012345678901uKv7';

      jest.spyOn(service as any, 'hashPassword').mockResolvedValue(hash);
      jest.spyOn(entityManager, 'save').mockRejectedValue(
        Object.assign(new QueryFailedError('', [], {} as Error), { code: '23505' }),
      );

      try {
        await service.createUser(name, email, password);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getUserByLogin', () => {
    const email = 'alexi@gmail.com';
    const password = 'password';

    const hash = '$2a$10$123456789012345678901uKv7';

    const userRecord = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alexi',
      email: 'alexi@gmail.com',
      password: hash,
      createdAt: '2024-04-16T07:51:51.108Z',
      updatedAt: '2024-04-16T07:51:51.108Z',
    } as UserEntity;

    it('should return user by login data', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(true));
      jest.spyOn(service as any, 'hashPassword').mockResolvedValue(hash);
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve({ ...userRecord }));

      const result = await service.getUserByLogin(email, password);

      expect(result).toEqual({ ...userRecord });
    });

    it('should return null when email not exists in DB', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      const result = await service.getUserByLogin(email, password);

      expect(result).toBe(null);
    });

    it('should return null when password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(false));
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve({ ...userRecord }));

      const result = await service.getUserByLogin(email, password);

      expect(result).toBe(null);
    });
  });

  describe('hashPassword', () => {
    const password = 'password';

    it('should return password in the hashed form', async () => {
      const saltRounds = configService.get('auth.saltRounds');

      const result = await (service as any).hashPassword(password);
      const regExp = new RegExp(`^\\$2[ab]\\$${saltRounds}\\$.{${55 - (saltRounds + '').length}}$`);

      expect(result).toMatch(regExp);
    });
  });
});
