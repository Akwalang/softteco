import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';

import { UserEntity } from './entities/user.entity';

import { bcrypt } from '../../common/utils/bcrypt';
import { isDuplicateError } from '../../common/utils/typeorm';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(name: string, email: string, password: string): Promise<UserEntity> {
    const hashedPassword = await this.hashPassword(password);

    try {
      return await this.entityManager.save(UserEntity, {
        name,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new BadRequestException('User with this email already exists');
      }

      throw error;
    }
  }

  async getUserByLogin(email: string, password: string): Promise<UserEntity | null> {
    const user = (await this.entityManager.findOne(UserEntity, {
      where: { email },
    })) as UserEntity | null;

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);

    return isValidPassword ? user : null;
  }

  private hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('auth.saltRounds');

    return bcrypt.hash(password, saltRounds);
  }
}
