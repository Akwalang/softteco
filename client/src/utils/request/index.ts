type FetchOptions = Parameters<typeof fetch>[1];

export const request = async <T extends Record<string, unknown>>(
  url: string,
  method: FetchOptions['method'] = 'GET',
  body?: FetchOptions['body'],
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
