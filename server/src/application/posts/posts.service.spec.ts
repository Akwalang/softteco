import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';

import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService) as PostsService;
    entityManager = module.get<EntityManager>(EntityManager) as EntityManager;
  });

  describe('getAllPosts', () => {
    it('should return list of all posts', async () => {
      const posts = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          createdAt: '2024-04-15T12:21:12.243Z',
          title: 'The Beauty of Nature',
          alias: 'the-beauty-of-nature',
          author: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Alexi',
          },
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          createdAt: '2024-04-14T09:12:40.116Z',
          title: 'The Joy of Cooking',
          alias: 'the-joy-of-cooking',
          author: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Alexi',
          },
        },
      ];

      jest.spyOn(entityManager, 'find').mockResolvedValue(Promise.resolve(posts));

      const result = await service.getAllPosts();

      expect(result).toEqual(posts);
    });
  });

  describe('getPost', () => {
    it('should return post by its alias', async () => {
      const post = {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'The Beauty of Nature',
        alias: 'the-beauty-of-nature',
        content: '<p>Nature offers a tapestry of marvelous sights</p>',
        author: {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Alexi',
        },
        comments: [],
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(post));

      const result = await service.getPost(post.alias);

      expect(result).toEqual(post);
    });

    it(`should return 404 error when record isn't exists`, async () => {
      const alias = 'the-beauty-of-nature';

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await service.getPost(alias);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createPost', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const post = {
      title: 'The Beauty of Nature',
      alias: 'the-beauty-of-nature',
      content: '<p>Nature offers a tapestry of marvelous sights</p>',
    };

    it('should create post', async () => {
      const postRecord = {
        id: '00000000-0000-0000-0000-000000000001',
        ...post,
        comments: [],
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      const expectedResult = {
        id: '00000000-0000-0000-0000-000000000001',
        ...post,
        author: {
          id: user.userId,
          name: user.userName,
        },
        comments: [],
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest.spyOn(entityManager, 'save').mockResolvedValue(Promise.resolve(postRecord));

      const result = await service.createPost(user, post);

      expect(result).toEqual(expectedResult);
    });

    it(`should return error when record with the same alias already exists`, async () => {
      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValue(
          Object.assign(new QueryFailedError('', [], {} as Error), { code: '23505' }),
        );

      try {
        await service.createPost(user, post);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updatePost', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const postId = '00000000-0000-0000-0000-000000000001';

    const postUpdate = {
      title: 'Update: The Beauty of Nature',
      alias: 'update-the-beauty-of-nature',
      content: '<p>Update: Nature offers a tapestry of marvelous sights</p>',
    };

    it('should update post by its id', async () => {
      const postRecord = {
        id: postId,
        title: 'The Beauty of Nature',
        alias: 'the-beauty-of-nature',
        content: '<p>Nature offers a tapestry of marvelous sights</p>',
        authorId: '00000000-0000-0000-0000-000000000001',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      const expectedResult = {
        ...postRecord,
        ...postUpdate,
      };

      delete expectedResult.authorId;

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(postRecord));

      const result = await service.updatePost(user, postId, postUpdate);

      expect(result).toEqual(expectedResult);
    });

    it(`should throw an error when user is not the author of the post`, async () => {
      const postRecord = {
        id: postId,
        title: 'The Beauty of Nature',
        alias: 'the-beauty-of-nature',
        content: '<p>Nature offers a tapestry of marvelous sights</p>',
        authorId: '00000000-0000-0000-0000-000000000002',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(postRecord));

      try {
        await service.updatePost(user, postId, postUpdate);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it(`should throw an error when post isn't exists`, async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await service.updatePost(user, postId, postUpdate);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deletePost', () => {
    const user = {
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Alexi',
    };

    const postId = '00000000-0000-0000-0000-000000000001';

    it('should delete post by its id', async () => {
      const postRecord = {
        id: postId,
        title: 'The Beauty of Nature',
        alias: 'the-beauty-of-nature',
        content: '<p>Nature offers a tapestry of marvelous sights</p>',
        authorId: '00000000-0000-0000-0000-000000000001',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(postRecord));

      const result = await service.deletePost(user, postId);

      expect(result).toEqual(postRecord);
    });

    it(`should throw an error when user is not the author of the post`, async () => {
      const postRecord = {
        id: postId,
        title: 'The Beauty of Nature',
        alias: 'the-beauty-of-nature',
        content: '<p>Nature offers a tapestry of marvelous sights</p>',
        authorId: '00000000-0000-0000-0000-000000000002',
        createdAt: '2024-04-15T12:21:12.243Z',
        updatedAt: '2024-04-15T13:33:47.563Z',
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(postRecord));

      try {
        await service.deletePost(user, postId);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it(`should throw an error when post isn't exists`, async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await service.deletePost(user, postId);
        expect('false').toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
