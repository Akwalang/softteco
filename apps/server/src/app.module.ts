import { Module, MiddlewareConsumer } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';

import { TraceMiddleware } from '@app/common/middlewares/trace';
import { LoggerMiddleware } from '@app/common/middlewares/logger';

@Module({
  imports: [ConfigModule, DbModule, AuthModule, PostsModule, CommentsModule, UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
