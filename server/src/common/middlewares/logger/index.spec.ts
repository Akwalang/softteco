import { LoggerMiddleware } from '.';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
  });

  describe('use', () => {
    it('should log request and response', () => {
      const request = {
        ip: '0.0.0.0',
        method: 'GET',
        originalUrl: '/users',
        body: { value: 10 },
        get: () => 'Firefox',
      } as unknown as Request;

      const response = {
        statusCode: 200,
        get: () => 100,
        on: (event: string, callback: () => void) => callback(),
      } as unknown as Response;

      const next = (() => {}) as unknown as NextFunction;

      const logSpy = jest.fn();

      (loggerMiddleware as any).logger.log = logSpy;

      loggerMiddleware.use(request, response, next);

      expect(logSpy).toHaveBeenCalledWith(
        `Request: GET /users, ip=0.0.0.0, user-agent=Firefox body={"value":10}`,
      );
      expect(logSpy).toHaveBeenCalledWith(`Response: code=200, content-length=100`);
    });
  });

  describe('maskSensitiveDate', () => {
    it('should mask email and password fields in the object', () => {
      const masked = loggerMiddleware.maskSensitiveDate({
        name: 'Alexi',
        email: 'alexi123@gmail.com',
        password: '123456',
      });

      expect(masked).toEqual({
        name: 'Alexi',
        email: 'a***3@gmail.com',
        password: '***',
      });
    });
  });
});
