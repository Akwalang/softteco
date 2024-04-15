import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PostParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}

export class PostAliasParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  alias: string;
}
