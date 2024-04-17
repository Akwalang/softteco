import { getNamespace } from 'cls-hooked';
import { Request, Response } from 'express';

import { TraceMiddleware } from '.';

import { TRACE_ID_KEY, TRACE_ID_SESSION_NAMESPACE } from '../../constants/trace';

describe('TraceMiddleware', () => {
  let traceMiddleware: TraceMiddleware;

  beforeEach(() => {
    traceMiddleware = new TraceMiddleware();
  });

  it('should be defined', () => {
    const request = {} as unknown as Request;
    const response = {} as unknown as Response;

    traceMiddleware.use(request, response, () => {
      const session = getNamespace(TRACE_ID_SESSION_NAMESPACE);
      const traceId = session?.get(TRACE_ID_KEY);

      expect(traceId).toMatch(/^[a-z0-9]{10}$/);
    });
  });
});
