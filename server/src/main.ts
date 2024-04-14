import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './application/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    credentials: true,
    origin: /https?:\/\/localhost(:\d+)?/,
  });

  const config = new DocumentBuilder()
    .setTitle('Blog api')
    .setVersion('1.0')
    .addTag('blog')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const host = configService.get('server.host');
  const port = configService.get('server.port');

  await app.listen(port, host);
}

bootstrap();
