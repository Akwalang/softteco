import { Entity, Unique, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/entities/abstract.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('post')
@Unique(['alias'])
export class PostEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  alias: string;

  @Column()
  content: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
