import { PickType } from '@nestjs/swagger';
import { CommentDto } from './common.dto';

export class CommentCreateRequestDto extends PickType(CommentDto, ['message'] as const) {}

export class CommentCreateResponseDto extends PickType(CommentDto, [
  'id',
  'message',
  'createdAt',
  'updatedAt',
  'authorId',
] as const) {}
