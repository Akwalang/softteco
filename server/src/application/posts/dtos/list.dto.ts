import { PickType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostListItemResponseDto extends PickType(PostDto, [
  'id',
  'title',
  'alias',
  'author',
  'createdAt',
  'updatedAt',
] as const) {}
