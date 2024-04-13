import { Controller, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';

import { SignInResponseDto, SignInRequestDto, SignUpRequestDto } from './dtos';
import { AUTH_COOKIE_NAME, COOKIE_SETTINGS } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignUpRequestDto,
  ): Promise<SignInResponseDto> {
    const { isAuthorized, token } = await this.authService.signUp(data);

    response.cookie(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);

    return { isAuthorized };
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const { token, ...other } = await this.authService.signIn(data);

    if (other.isAuthorized) {
      response.cookie(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);
    }

    return other;
  }

  @Post('sign-out')
  signOut(@Res({ passthrough: true }) response: Response): SignInResponseDto {
    response.clearCookie(AUTH_COOKIE_NAME, COOKIE_SETTINGS);

    return { isAuthorized: false };
  }
}
