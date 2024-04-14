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

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

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

  generateToken(user: UserEntity): Promise<string> {
    const payload = { sub: user.id, userId: user.id, userName: user.name };

    const options = {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    };

    return this.jwtService.signAsync(payload, options);
  }
}
