/* eslint-disable @typescript-eslint/no-explicit-any */
type FetchOptions = Exclude<Parameters<typeof fetch>[1], undefined>;

export const request = async <T extends Record<string, any>>(
  url: string,
  method: FetchOptions['method'] = 'GET',
  body?: Record<string, any>,
  headers?: FetchOptions['headers'],
): Promise<T> => {
  const options: FetchOptions = { method };

  if (method === 'POST' || method === 'PATCH') {
    options.headers = { 'Content-Type': 'application/json' };
    Object.assign(options.headers, headers);
  }

  options.credentials = 'include';

  if (body) {
    options.body = typeof body !== 'string' ? JSON.stringify(body) : body;
  }

  return (await fetch(url, options)).json();
};
