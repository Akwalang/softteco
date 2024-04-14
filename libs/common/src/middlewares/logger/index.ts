import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { Logger } from '../../classes/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;

    const userAgent = request.get('user-agent') || '';

    const body = this.maskSensitiveDate({ ...request.body });
    const bodyStr = JSON.stringify(body);

    this.logger.log(
      `Request: ${method} ${originalUrl}, ip=${ip}, user-agent=${userAgent} body=${bodyStr}`,
    );

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(`Response: code=${statusCode}, content-length=${contentLength}`);
    });

    next && next();
  }

  maskSensitiveDate(body: Record<string, any>): Record<string, any> {
    if ('email' in body) {
      body['email'] = body['email'].replace(/^(\w)(?:\w*?)(\w?)@/i, '$1***$2@');
    }

    if ('password' in body) {
      body['password'] = '***';
    }

    return body;
  }
}
