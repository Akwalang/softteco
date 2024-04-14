import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserModule } from '../user';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [UserModule],
  providers: [JwtService, AuthService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
