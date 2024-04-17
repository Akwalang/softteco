import { Logger } from '.';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('Logger');
  });

  it('should log message', () => {
    let message = '';

    jest.spyOn(process.stdout, 'write').mockImplementationOnce(
      jest.fn((text: string) => {
        message = text;
      }) as any,
    );

    logger.log('test');

    expect(message).toMatch(/\[traceId=undefined]/);
    expect(message).toMatch(/test/);
  });

  it('should log error stack', () => {
    let message = '';

    jest.spyOn(process.stderr, 'write').mockImplementationOnce(
      jest.fn((text: string) => {
        message = text;
      }) as any,
    );

    logger.error(new Error('test'));

    expect(message).toMatch(/Error: test/);
  });

  it('should log error message', () => {
    let message = '';

    jest.spyOn(process.stderr, 'write').mockImplementationOnce(
      jest.fn((text: string) => {
        message = text;
      }) as any,
    );

    logger.error({ message: 'Error: test' } as Error);

    expect(message).toMatch(/Error: test/);
  });

  it('should log empty error', () => {
    let message = '';

    jest.spyOn(process.stderr, 'write').mockImplementationOnce(
      jest.fn((text: string) => {
        message = text;
      }) as any,
    );

    logger.error({} as Error);

    expect(typeof message).toBe('string');
  });
});
