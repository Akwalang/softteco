import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';

import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService) as CommentsService;
    entityManager = module.get<EntityManager>(EntityManager) as EntityManager;
  });

  describe('createComment', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const postId = '00000000-0000-0000-0000-000000000001';

    const comment = {
      message: 'Discussing the personal and creative aspects of cooking',
    };

    it('should return comment by its alias', async () => {
      const commentRecord = {
        id: '00000000-0000-0000-0000-000000000001',
        postId,
        authorId: user.userId,
        ...comment,
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      const expectedResult = {
        ...commentRecord,
        author: {
          id: user.userId,
          name: user.userName,
        },
      };

      jest.spyOn(entityManager, 'save').mockResolvedValue(Promise.resolve(commentRecord));

      const result = await service.createComment(user, postId, comment);

      expect(result).toEqual(expectedResult);
    });

    it(`should return 404 error when post isn't exists`, async () => {
      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValue(
          Object.assign(new QueryFailedError('', [], {} as Error), { code: '23503' }),
        );

      try {
        await service.createComment(user, postId, comment);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateComment', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const postId = '00000000-0000-0000-0000-000000000001';
    const commentId = '00000000-0000-0000-0000-000000000001';

    const commentUpdate = {
      message: 'Update: Discussing the personal and creative aspects of cooking',
    };

    it('should update comment by its id', async () => {
      const commentRecord = {
        id: commentId,
        postId,
        message: 'Discussing the personal and creative aspects of cooking',
        authorId: '00000000-0000-0000-0000-000000000001',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      const expectedResult = {
        ...commentRecord,
        ...commentUpdate,
      };

      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValue(Promise.resolve(commentRecord));

      const result = await service.updateComment(user, postId, commentId, commentUpdate);

      expect(result).toEqual(expectedResult);
    });

    it(`should throw an error when user is not the author of the comment`, async () => {
      const commentRecord = {
        id: commentId,
        postId,
        message: 'Discussing the personal and creative aspects of cooking',
        authorId: '00000000-0000-0000-0000-000000000002',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValue(Promise.resolve(commentRecord));

      try {
        await service.updateComment(user, postId, commentId, commentUpdate);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it(`should throw an error when comment isn't exists`, async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await service.updateComment(user, postId, commentId, commentUpdate);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteComment', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const postId = '00000000-0000-0000-0000-000000000001';
    const commentId = '00000000-0000-0000-0000-000000000001';

    it('should delete comment by its id', async () => {
      const commentRecord = {
        id: commentId,
        postId,
        message: 'Discussing the personal and creative aspects of cooking',
        authorId: '00000000-0000-0000-0000-000000000001',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValue(Promise.resolve(commentRecord));

      const result = await service.deleteComment(user, postId, commentId);

      expect(result).toEqual(commentRecord);
    });

    it(`should throw an error when user is not author of the comment`, async () => {
      const commentRecord = {
        id: commentId,
        postId,
        message: 'Discussing the personal and creative aspects of cooking',
        authorId: '00000000-0000-0000-0000-000000000002',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValue(Promise.resolve(commentRecord));

      try {
        await service.deleteComment(user, postId, commentId);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it(`should throw an error when comment isn't exists`, async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await service.deleteComment(user, postId, commentId);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
