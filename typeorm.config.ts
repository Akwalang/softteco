import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrationsTableName: '_migrations',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/server/apps/server/migrations/*.js'],
});
