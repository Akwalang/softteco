import { Controller, Param, Body, Post, Patch, Delete } from '@nestjs/common';

import { CommentsService } from './comments.service';

import {
  PostParamsDto,
  CommentParamsDto,
  CommentCreateRequestDto,
  CommentCreateResponseDto,
  CommentUpdateResponseDto,
  CommentUpdateRequestDto,
} from './dtos';

import { AuthUser, GetAuthUser, UseAuthGuard } from '../auth';

@Controller('/posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('')
  @UseAuthGuard()
  createComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
    @Body() data: CommentCreateRequestDto,
  ): Promise<CommentCreateResponseDto> {
    return this.commentsService.createComment(user, postId, data);
  }

  @Patch(':commentId')
  @UseAuthGuard()
  updateComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId, commentId }: CommentParamsDto,
    @Body() data: CommentUpdateRequestDto,
  ): Promise<CommentUpdateResponseDto> {
    return this.commentsService.updateComment(user, postId, commentId, data);
  }

  @Delete(':commentId')
  @UseAuthGuard()
  deleteComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId, commentId }: CommentParamsDto,
  ): Promise<CommentUpdateResponseDto> {
    return this.commentsService.deleteComment(user, postId, commentId);
  }
}
