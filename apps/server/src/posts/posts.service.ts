import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PostEntity } from './entities/post.entity';

import {
  PostListItemResponseDto,
  PostCreateRequestDto,
  PostCreateResponseDto,
  PostUpdateRequestDto,
  PostUpdateResponseDto,
  PostDeleteResponseDto,
} from './dtos';
import { isDuplicateError } from '@app/common/utils/typeorm';
import { AuthUser } from '../auth';

@Injectable()
export class PostsService {
  constructor(private entityManager: EntityManager) {}

  getAllPosts(): Promise<PostListItemResponseDto[]> {
    return this.entityManager.find(PostEntity, {
      select: {
        id: true,
        title: true,
        alias: true,
        createdAt: true,
        author: { id: true, name: true },
      },
      relations: ['author'],
    });
  }

  getPost(postId: string): Promise<PostCreateResponseDto> {
    return this.entityManager.findOne(PostEntity, {
      select: {
        id: true,
        title: true,
        alias: true,
        content: true,
        createdAt: true,
        author: { id: true, name: true },
      },
      where: { id: postId },
      relations: ['author'],
    });
  }

  async createPost(
    user: AuthUser,
    data: PostCreateRequestDto,
  ): Promise<PostCreateResponseDto> {
    try {
      return await this.entityManager.save(PostEntity, {
        ...data,
        authorId: user.userId,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new BadRequestException('Post with this alias already exists');
      }

      throw error;
    }
  }

  async updatePost(
    user: AuthUser,
    postId: string,
    data: PostUpdateRequestDto,
  ): Promise<PostUpdateResponseDto> {
    const post = await this.entityManager.findOne(PostEntity, {
      where: { id: postId, author: { id: user.userId } },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    await this.entityManager.update(PostEntity, { id: postId }, data);

    return { ...post, ...data };
  }

  async deletePost(user: AuthUser, postId: string): Promise<PostDeleteResponseDto> {
    const post = await this.entityManager.findOne(PostEntity, {
      where: { id: postId },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    if (post.authorId !== user.userId) {
      throw new BadRequestException('You cannot delete this post');
    }

    await this.entityManager.delete(PostEntity, { id: postId });

    return post;
  }
}
