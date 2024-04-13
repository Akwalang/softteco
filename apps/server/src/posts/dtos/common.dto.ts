import * as sanitizeHtml from 'sanitize-html';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

import { trim, toAlias } from '@app/common/utils/string';

class AuthorDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

class CommentDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitizeHtml(trim(value), { allowedTags: [] }))
  message: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty()
  @IsObject()
  @Type(() => AuthorDto)
  author: AuthorDto;
}

export class PostDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  authorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitizeHtml(trim(value), { allowedTags: [] }))
  title: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value, obj }) =>
    sanitizeHtml(toAlias(value || obj.title), { allowedTags: [] }),
  )
  alias: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitizeHtml(trim(value)))
  content: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];

  @ApiProperty()
  @IsObject()
  @Type(() => AuthorDto)
  author: AuthorDto;
}
