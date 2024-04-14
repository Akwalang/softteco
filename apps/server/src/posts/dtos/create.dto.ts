import { OmitType, PickType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostCreateRequestDto extends PickType(PostDto, [
  'title',
  'alias',
  'content',
] as const) {}

export class PostCreateResponseDto extends OmitType(PostDto, [
  'author',
  'comments',
] as const) {}
