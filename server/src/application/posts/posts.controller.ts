import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { PostsService } from './posts.service';

import {
  PostListItemResponseDto,
  PostGetResponseDto,
  PostCreateRequestDto,
  PostCreateResponseDto,
  PostDeleteResponseDto,
  PostParamsDto,
  PostUpdateRequestDto,
  PostUpdateResponseDto, PostAliasParamsDto
} from './dtos';

import { UseAuthGuard, GetAuthUser, AuthUser } from '../auth';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('')
  @ApiOperation({ summary: 'Get list of posts' })
  @ApiResponse({ status: 200, type: PostListItemResponseDto, isArray: true })
  getAllPosts(): Promise<PostListItemResponseDto[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':alias')
  @ApiOperation({ summary: 'Get the post by alias' })
  @ApiParam({ name: 'alias', type: 'string' })
  @ApiResponse({ status: 200, type: PostGetResponseDto })
  getPost(@Param() { alias }: PostAliasParamsDto): Promise<PostGetResponseDto> {
    return this.postsService.getPost(alias);
  }

  @Post('')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, type: PostCreateResponseDto })
  createPost(
    @GetAuthUser() user: AuthUser,
    @Body() data: PostCreateRequestDto,
  ): Promise<PostCreateResponseDto> {
    return this.postsService.createPost(user, data);
  }

  @Patch(':postId')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Update the post by id' })
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiResponse({ status: 200, type: PostUpdateResponseDto })
  updatePost(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
    @Body() data: PostUpdateRequestDto,
  ): Promise<PostUpdateResponseDto> {
    return this.postsService.updatePost(user, postId, data);
  }

  @Delete(':postId')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Delete the post by id' })
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiResponse({ status: 204, type: PostDeleteResponseDto })
  deletePost(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
  ): Promise<PostDeleteResponseDto> {
    return this.postsService.deletePost(user, postId);
  }
}
