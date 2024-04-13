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

import { isForeignKeyError } from '@app/common/utils/typeorm';

@Injectable()
export class CommentsService {
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

      return comment as unknown as CommentCreateResponseDto;
    } catch (error) {
      if (isForeignKeyError(error)) {
        throw new NotFoundException('Post not found');
      }

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
      throw new BadRequestException('You cannot update this comment');
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
      throw new BadRequestException('You cannot delete this comment');
    }

    await this.entityManager.delete(CommentEntity, { id: commentId });

    return comment as CommentDeleteResponseDto;
  }
}
