import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PostEntity } from './entities/post.entity';

import {
  PostListItemResponseDto,
  PostGetResponseDto,
  PostCreateRequestDto,
  PostCreateResponseDto,
  PostUpdateRequestDto,
  PostUpdateResponseDto,
  PostDeleteResponseDto,
} from './dtos';

import { Logger } from '../../common/classes/logger';
import { isDuplicateError } from '../../common/utils/typeorm';

import { AuthUser } from '../auth';

@Injectable()
export class PostsService {
  private logger = new Logger(PostsService.name);

  constructor(private entityManager: EntityManager) {}

  async getAllPosts(): Promise<PostListItemResponseDto[]> {
    const posts = await this.entityManager.find(PostEntity, {
      select: {
        id: true,
        title: true,
        alias: true,
        createdAt: true,
        author: { id: true, name: true },
      },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return posts as PostListItemResponseDto[];
  }

  async getPost(alias: string): Promise<PostGetResponseDto> {
    const post = await this.entityManager.findOne(PostEntity, {
      select: {
        id: true,
        title: true,
        alias: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: { id: true, name: true },
        comments: {
          id: true,
          message: true,
          createdAt: true,
          updatedAt: true,
          author: { id: true, name: true },
        },
      },
      where: { alias },
      order: {
        comments: {
          createdAt: 'ASC',
        },
      },
      relations: ['author', 'comments', 'comments.author'],
    });

    if (!post) {
      this.logger.log(`Post with alias ${alias} not found`);
      throw new NotFoundException('Post not found');
    }

    return post as PostGetResponseDto;
  }

  async createPost(
    user: AuthUser,
    data: PostCreateRequestDto,
  ): Promise<PostCreateResponseDto> {
    if (!data.alias) {
      throw new BadRequestException('Alias should not be empty');
    }

    try {
      const post = await this.entityManager.save(PostEntity, {
        ...data,
        author: { id: user.userId },
      });

      delete post.authorId;

      return { ...post, author: { id: user.userId, name: user.userName } };
    } catch (error) {
      if (isDuplicateError(error)) {
        this.logger.log(`Post with alias "${data.alias}" already exists`);
        throw new BadRequestException('Post with this alias already exists');
      }

      this.logger.error(error);
      throw error;
    }
  }

  async updatePost(
    user: AuthUser,
    postId: string,
    data: PostUpdateRequestDto,
  ): Promise<PostUpdateResponseDto> {
    const post = await this.entityManager.findOne(PostEntity, {
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.userId) {
      this.logger.log(
        `User with id "${user.userId}" trying to update not his post with id "${postId}"`,
      );
      throw new BadRequestException('Access denied');
    }

    await this.entityManager.update(PostEntity, { id: postId }, { ...data });

    const result = { ...post, ...data };

    delete result.authorId;

    return result;
  }

  async deletePost(user: AuthUser, postId: string): Promise<PostDeleteResponseDto> {
    const post = (await this.entityManager.findOne(PostEntity, {
      where: { id: postId },
    })) as PostEntity;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.userId) {
      this.logger.log(
        `User with id "${user.userId}" trying to remove not his post with id "${postId}"`,
      );
      throw new BadRequestException('You cannot delete this post');
    }

    await this.entityManager.delete(PostEntity, { id: postId });

    delete post.authorId;

    return post as PostDeleteResponseDto;
  }
}
