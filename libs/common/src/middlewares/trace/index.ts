import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createNamespace } from 'cls-hooked';

import { TRACE_ID_SESSION_NAMESPACE, TRACE_ID_KEY } from '../../constants/trace';

const session = createNamespace(TRACE_ID_SESSION_NAMESPACE);

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const traceId = Math.random().toString(36).slice(2, 12);

    session.run(() => {
      session.set(TRACE_ID_KEY, traceId);

      next && next();
    });
  }
}
