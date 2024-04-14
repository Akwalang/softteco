import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { trim } from '../../../common/utils/string/trim';

export class SignInRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => trim(value).toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  @IsBoolean()
  isAuthorized: boolean;

  @ApiProperty()
  @ValidateIf((data) => data.isAuthorized)
  @IsUUID()
  id?: string;

  @ApiProperty()
  @ValidateIf((data) => data.isAuthorized)
  @IsString()
  name?: string;
}
