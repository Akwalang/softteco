import { NotFoundException, Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CommentEntity } from './entities/comment.entity';

import {
  CommentCreateRequestDto,
  CommentCreateResponseDto,
  CommentDeleteResponseDto,
  CommentUpdateRequestDto,
  CommentUpdateResponseDto,
} from './dtos';

import { AuthUser } from '../auth';

import { isForeignKeyError } from '../../common/utils/typeorm';
import { Logger } from '../../common/classes/logger';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(private entityManager: EntityManager) {}

  async createComment(
    user: AuthUser,
    postId: string,
    data: CommentCreateRequestDto,
  ): Promise<CommentCreateResponseDto> {
    try {
      const comment = await this.entityManager.save(CommentEntity, {
        authorId: user.userId,
        postId,
        ...data,
      });

      delete comment.authorId;

      return {
        ...comment,
        author: {
          id: user.userId,
          name: user.userName,
        },
      };
    } catch (error) {
      if (isForeignKeyError(error)) {
        this.logger.log(`Post with id ${postId} not found`);
        throw new NotFoundException('Post not found');
      }

      this.logger.error(error);
      throw error;
    }
  }

  async updateComment(
    user: AuthUser,
    postId: string,
    commentId: string,
    data: CommentUpdateRequestDto,
  ): Promise<CommentUpdateResponseDto> {
    const comment = await this.entityManager.findOne(CommentEntity, {
      where: {
        id: commentId,
        postId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== user.userId) {
      this.logger.log(
        `User with id "${user.userId}" trying to update not his comment with id "${commentId}"`,
      );
      throw new BadRequestException('Access denied');
    }

    await this.entityManager.update(CommentEntity, { id: commentId }, { ...data });

    return { ...comment, ...data } as CommentUpdateResponseDto;
  }

  async deleteComment(
    user: AuthUser,
    postId: string,
    commentId: string,
  ): Promise<CommentDeleteResponseDto> {
    const comment = await this.entityManager.findOne(CommentEntity, {
      where: {
        id: commentId,
        postId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== user.userId) {
      this.logger.log(
        `User with id "${user.userId}" trying to remove not his comment with id "${commentId}"`,
      );
      throw new BadRequestException('You cannot delete this comment');
    }

    await this.entityManager.delete(CommentEntity, { id: commentId });

    return comment as CommentDeleteResponseDto;
  }
}
