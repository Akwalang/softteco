import { PickType } from '@nestjs/swagger';

import { CommentDto } from './common.dto';

export class CommentUpdateRequestDto extends PickType(CommentDto, ['message'] as const) {}

export class CommentUpdateResponseDto extends PickType(CommentDto, [
  'id',
  'message',
  'authorId',
  'createdAt',
  'updatedAt',
] as const) {}
