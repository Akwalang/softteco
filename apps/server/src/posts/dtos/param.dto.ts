import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostParamsDto {
  @ApiProperty()
  @IsString()
  postId: string;
}
