import { Client } from 'pg';

const bootstrap = async () => {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  });
  await client.connect();

  const dbName = process.env.DATABASE_NAME;

  const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);

  if (res.rowCount === 0) {
    console.log(`${dbName} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${dbName}";`);
    console.log(`created database ${dbName}`);
  } else {
    console.log(`${dbName} database exists.`);
  }

  await client.end();
};

bootstrap();
