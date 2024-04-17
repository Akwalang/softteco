import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { IsDateString, IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

import * as sanitizeHtml from 'sanitize-html';

import { trim } from '../../../common/utils/string';

class AuthorDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CommentDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    return sanitizeHtml(trim(value), {
      allowedTags: ['br', 'b', 'i'],
      allowedAttributes: {},
    });
  })
  message: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty()
  @IsUUID()
  authorId: string;

  @ApiProperty()
  @IsObject()
  @Type(() => AuthorDto)
  author: AuthorDto;
}
