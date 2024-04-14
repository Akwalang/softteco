import { Controller, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

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
@ApiParam({ name: 'postId', type: 'string' })
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiResponse({ status: 201, type: CommentCreateResponseDto })
  createComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
    @Body() data: CommentCreateRequestDto,
  ): Promise<CommentCreateResponseDto> {
    return this.commentsService.createComment(user, postId, data);
  }

  @Patch(':commentId')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Update the comment by id' })
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiResponse({ status: 200, type: CommentUpdateResponseDto })
  updateComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId, commentId }: CommentParamsDto,
    @Body() data: CommentUpdateRequestDto,
  ): Promise<CommentUpdateResponseDto> {
    return this.commentsService.updateComment(user, postId, commentId, data);
  }

  @Delete(':commentId')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Delete the comment by id' })
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiResponse({ status: 204, type: CommentUpdateResponseDto })
  deleteComment(
    @GetAuthUser() user: AuthUser,
    @Param() { postId, commentId }: CommentParamsDto,
  ): Promise<CommentUpdateResponseDto> {
    return this.commentsService.deleteComment(user, postId, commentId);
  }
}
