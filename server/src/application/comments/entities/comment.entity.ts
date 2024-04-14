import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('comment')
@Index(['postId'])
export class CommentEntity extends AbstractEntity {
  @Column()
  message: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
