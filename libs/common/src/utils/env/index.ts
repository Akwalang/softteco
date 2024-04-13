import * as dotenv from 'dotenv';

dotenv.config();

export enum TYPES {
  String,
  Int,
  Bool,
}

function env(name: string): string;
function env(name: string, type: TYPES.String): string;
function env(name: string, type: TYPES.Int): number;
function env(name: string, type: TYPES.Bool): boolean;

function env(name: string, type?: TYPES): string | number | boolean {
  const value = process.env;

  switch (type) {
    case TYPES.Int:
      return parseInt(value[name], 10);
    case TYPES.Bool:
      return value[name] === 'true';
    default:
      return value[name];
  }
}

export { env };
