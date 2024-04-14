import { Module, MiddlewareConsumer } from '@nestjs/common';

import { DbModule } from './db';
import { ConfigModule } from './config';
import { AuthModule } from './auth';
import { PostsModule } from './posts';
import { CommentsModule } from './comments';
import { UserModule } from './user';

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
