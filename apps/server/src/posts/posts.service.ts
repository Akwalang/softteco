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
import { isDuplicateError } from '@app/common/utils/typeorm';
import { AuthUser } from '../auth';

@Injectable()
export class PostsService {
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
    });

    return posts as PostListItemResponseDto[];
  }

  async getPost(postId: string): Promise<PostGetResponseDto> {
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
      where: { id: postId },
      relations: ['author', 'comments', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post as PostGetResponseDto;
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

    await this.entityManager.update(PostEntity, { id: postId }, { ...data });

    return { ...post, ...data } as PostUpdateResponseDto;
  }

  async deletePost(user: AuthUser, postId: string): Promise<PostDeleteResponseDto> {
    const post = await this.entityManager.findOne(PostEntity, {
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.userId) {
      throw new BadRequestException('You cannot delete this post');
    }

    await this.entityManager.delete(PostEntity, { id: postId });

    return post as PostDeleteResponseDto;
  }
}
