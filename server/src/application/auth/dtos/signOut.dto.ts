import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SignOutResponseDto {
  @ApiProperty()
  @IsBoolean()
  isAuthorized: false;
}
