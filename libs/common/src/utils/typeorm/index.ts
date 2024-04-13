import { QueryFailedError } from 'typeorm';

const DUPLICATE_ERROR_CODE = '23505';
const FOREIGN_KEY_ERROR_CODE = '23503';

const isQueryError = (error: unknown): error is QueryFailedError & { code: string } => {
  return error instanceof QueryFailedError && typeof error['code'] === 'string';
};

export const isDuplicateError = (error: unknown): boolean => {
  return isQueryError(error) && error.code === DUPLICATE_ERROR_CODE;
};

export const isForeignKeyError = (error: unknown): boolean => {
  return isQueryError(error) && error.code === FOREIGN_KEY_ERROR_CODE;
};
