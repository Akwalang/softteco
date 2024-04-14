import { PickType } from '@nestjs/swagger';

import { CommentDto } from './common.dto';

export class CommentDeleteResponseDto extends PickType(CommentDto, [
  'id',
  'message',
  'authorId',
  'createdAt',
  'updatedAt',
] as const) {}
