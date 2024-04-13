import { PickType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostCreateRequestDto extends PickType(PostDto, [
  'title',
  'alias',
  'content',
] as const) {}

export class PostCreateResponseDto extends PostDto {}
