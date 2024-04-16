import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

import {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from './dtos';

import { UserEntity } from '../user/entities/user.entity';
import { AuthUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async getTokenData(token: string): Promise<SignInResponseDto> {
    const data = token ? await this.parseToken(token) : null;

    const isAuthorized = !!data;

    if (!isAuthorized) return { isAuthorized: false };

    const { userId: id, userName: name } = data;

    return { isAuthorized, id, name };
  }

  async signUp(data: SignUpRequestDto): Promise<SignUpResponseDto & { token: string }> {
    const user = await this.userService.createUser(data.name, data.email, data.password);

    return {
      isAuthorized: true,
      id: user.id,
      name: user.name,
      token: await this.generateToken(user),
    };
  }

  async signIn(data: SignInRequestDto): Promise<SignInResponseDto & { token?: string }> {
    const user = await this.userService.getUserByLogin(data.email, data.password);

    if (!user) {
      return { isAuthorized: false };
    }

    return {
      isAuthorized: true,
      id: user.id,
      name: user.name,
      token: await this.generateToken(user),
    };
  }

  private async parseToken(token: string): Promise<AuthUser | null> {
    const secret = this.configService.get('jwt.secret');

    try {
      const { userId, userName } = await this.jwtService.verifyAsync(token, { secret });

      return { userId, userName };
    } catch (error) {
      return null;
    }
  }

  private generateToken(user: UserEntity): Promise<string> {
    const payload = { sub: user.id, userId: user.id, userName: user.name };

    const options = {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    };

    return this.jwtService.signAsync(payload, options);
  }
}
