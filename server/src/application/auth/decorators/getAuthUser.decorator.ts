import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from '../types';

export const GetAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
