import { UseGuards, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AUTH_COOKIE_NAME } from './constants';

export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies[AUTH_COOKIE_NAME];

    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
