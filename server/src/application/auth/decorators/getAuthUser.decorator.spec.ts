import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';

import { GetAuthUser } from './getAuthUser.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
function getParamDecoratorFactory(decorator: Function) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public test(@decorator() value: any) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('GetAuthUser', () => {
  const user = {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Alexi',
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;

  it('should return user from request', () => {
    const factory = getParamDecoratorFactory(GetAuthUser);
    const result = factory(null, context);

    expect(result).toBe(user);
  });
});
