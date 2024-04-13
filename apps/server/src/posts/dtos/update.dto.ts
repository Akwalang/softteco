import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';
import { PostDto } from './common.dto';

export class PostUpdateRequestDto extends PickType(PostDto, [
  'title',
  'alias',
  'content',
] as const) {}

export class PostUpdateResponseDto extends PostDto {}
