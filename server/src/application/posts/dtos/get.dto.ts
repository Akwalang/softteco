import { PickType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostGetResponseDto extends PickType(PostDto, [
  'id',
  'title',
  'alias',
  'content',
  'comments',
  'author',
  'createdAt',
  'updatedAt',
] as const) {}
