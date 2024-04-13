import { Entity, Column, Unique } from 'typeorm';

import { AbstractEntity } from '@app/common/entities/abstract.entity';

@Entity('user')
@Unique(['email'])
export class UserEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
