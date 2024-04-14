import { OmitType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostDeleteResponseDto extends OmitType(PostDto, [
  'author',
  'comments',
] as const) {}
