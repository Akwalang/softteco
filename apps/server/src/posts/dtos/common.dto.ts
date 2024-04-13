import * as sanitizeHtml from 'sanitize-html';
import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { trim, toAlias } from '@app/common/utils/string';

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
}
