import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';

import { isDuplicateError } from '@app/common/utils/typeorm';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private readonly entityManager: EntityManager,
    // @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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

  hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('auth.saltRounds');

    return bcrypt.hash(password, saltRounds);
  }
}
