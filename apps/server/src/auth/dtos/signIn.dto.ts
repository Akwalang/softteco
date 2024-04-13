import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, IsUUID, ValidateIf } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
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
