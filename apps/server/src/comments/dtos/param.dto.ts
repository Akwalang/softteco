import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PostParamsDto {
  @ApiProperty()
  @IsUUID()
  postId: string;
}

export class CommentParamsDto extends PostParamsDto {
  @ApiProperty()
  @IsUUID()
  commentId: string;
}
