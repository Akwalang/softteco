import { Entity, Column, Unique, OneToMany } from 'typeorm';

import { AbstractEntity } from '@app/common/entities/abstract.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('user')
@Unique(['email'])
export class UserEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}