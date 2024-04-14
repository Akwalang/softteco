import {
  Injectable,
  UseGuards,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { AUTH_COOKIE_NAME } from './constants';
import { AuthUser } from './types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      request['user'] = await this.getUserData(request);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserData(request: Request): Promise<AuthUser> {
    const token = request.cookies[AUTH_COOKIE_NAME];

    const secret = this.configService.get<string>('jwt.secret');
    const { userId, userName } = await this.jwtService.verifyAsync(token, { secret });

    return { userId, userName };
  }
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
