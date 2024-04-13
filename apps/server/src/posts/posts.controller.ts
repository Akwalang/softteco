import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';

import { PostsService } from './posts.service';

import {
  PostCreateRequestDto,
  PostCreateResponseDto,
  PostDeleteResponseDto,
  PostListItemResponseDto,
  PostParamsDto,
  PostUpdateRequestDto,
  PostUpdateResponseDto,
} from './dtos';

import { UseAuthGuard, GetAuthUser, AuthUser } from '../auth';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('')
  getAllPosts(): Promise<PostListItemResponseDto[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':postId')
  getPost(@Param() { postId }: PostParamsDto): Promise<PostCreateResponseDto> {
    return this.postsService.getPost(postId);
  }

  @Post('')
  @UseAuthGuard()
  createPost(
    @GetAuthUser() user: AuthUser,
    @Body() data: PostCreateRequestDto,
  ): Promise<PostCreateResponseDto> {
    return this.postsService.createPost(user, data);
  }

  @Patch(':postId')
  @UseAuthGuard()
  updatePost(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
    @Body() data: PostUpdateRequestDto,
  ): Promise<PostUpdateResponseDto> {
    return this.postsService.updatePost(user, postId, data);
  }

  @Delete(':postId')
  @UseAuthGuard()
  deletePost(
    @GetAuthUser() user: AuthUser,
    @Param() { postId }: PostParamsDto,
  ): Promise<PostDeleteResponseDto> {
    return this.postsService.deletePost(user, postId);
  }
}
