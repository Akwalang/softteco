import { env, TYPES } from '.';

describe('env', () => {
  beforeAll(() => {
    process.env.ENV_TEST_STRING = 'test';
    process.env.ENV_TEST_INT = '10';
    process.env.ENV_TEST_BOOLEAN = 'true';
  });

  afterAll(() => {
    delete process.env.ENV_TEST_STRING;
    delete process.env.ENV_TEST_INT;
    delete process.env.ENV_TEST_BOOLEAN;
  });

  it('should return a string value', () => {
    expect(env('ENV_TEST_STRING', TYPES.String)).toBe('test');
  });

  it('should return a string value', () => {
    expect(env('ENV_TEST_INT', TYPES.Int)).toBe(10);
  });

  it('should return a string value', () => {
    expect(env('ENV_TEST_BOOLEAN', TYPES.Bool)).toBe(true);
  });
});
