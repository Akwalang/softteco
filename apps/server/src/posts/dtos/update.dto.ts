import { OmitType, PickType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostUpdateRequestDto extends PickType(PostDto, [
  'title',
  'alias',
  'content',
] as const) {}

export class PostUpdateResponseDto extends OmitType(PostDto, [
  'author',
  'comments',
] as const) {}
