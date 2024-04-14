import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, DbModule, AuthModule, PostsModule, CommentsModule, UserModule],
})
export class AppModule {}
