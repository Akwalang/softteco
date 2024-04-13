import { env, TYPES } from '@app/common/utils/env';

export const config = () =>
  ({
    server: {
      host: env('HTTP_HOST', TYPES.String) || 'localhost',
      port: env('HTTP_PORT', TYPES.Int) || 3000,
    },
    typeorm: {
      type: 'postgres',
      host: env('DATABASE_HOST', TYPES.String),
      port: env('DATABASE_PORT', TYPES.Int),
      username: env('DATABASE_USER', TYPES.String),
      password: env('DATABASE_PASSWORD', TYPES.String),
      database: env('DATABASE_NAME', TYPES.String),
    },
    auth: {
      saltRounds: env('AUTH_SALT_ROUNDS', TYPES.Int),
    },
    jwt: {
      secret: env('JWT_SECRET', TYPES.String),
      expiresIn: env('JWT_EXPIRES_IN', TYPES.String),
    },
  }) as const;
