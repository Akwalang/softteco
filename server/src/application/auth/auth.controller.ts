import { Controller, Post, Res, Body, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { SignInResponseDto, SignInRequestDto, SignUpRequestDto } from './dtos';
import { AUTH_COOKIE_NAME, COOKIE_SETTINGS } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Return user data' })
  @ApiResponse({ status: 200, type: SignInResponseDto })
  async me(@Req() request: Request): Promise<SignInResponseDto> {
    const token = request.cookies[AUTH_COOKIE_NAME];

    return this.authService.getTokenData(token);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, type: SignInResponseDto })
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignUpRequestDto,
  ): Promise<SignInResponseDto> {
    const { id, name, isAuthorized, token } = await this.authService.signUp(data);

    response.cookie(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);

    return { id, name, isAuthorized };
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, type: SignInResponseDto })
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const { id, name, isAuthorized, token } = await this.authService.signIn(data);

    if (isAuthorized) {
      response.cookie(AUTH_COOKIE_NAME, token, COOKIE_SETTINGS);
    }

    return { id, name, isAuthorized };
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, type: SignInResponseDto })
  signOut(@Res({ passthrough: true }) response: Response): SignInResponseDto {
    response.clearCookie(AUTH_COOKIE_NAME, COOKIE_SETTINGS);

    return { isAuthorized: false };
  }
}
