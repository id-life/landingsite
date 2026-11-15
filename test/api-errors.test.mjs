// ENG-07: a failed API call rejects with an ApiError that tells "no such item" (400/404) from "API down".
import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request, { ApiError, isApiNotFound } from '@/apis/request';

let server;
let base;
beforeAll(async () => {
  server = createServer((req, res) => {
    const status = Number(req.url.split('/')[1]) || 200;
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ code: status, message: `status ${status}`, data: null }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
afterAll(() => new Promise((resolve) => server.close(resolve)));

const failure = (url) =>
  request.get(url).then(
    () => null,
    (error) => error,
  );

describe('API errors', () => {
  test('a 200 resolves to the body', async () => {
    await expect(request.get(`${base}/200`)).resolves.toMatchObject({ code: 200 });
  });

  test.each([400, 404])('HTTP %i is "not found"', async (status) => {
    const error = await failure(`${base}/${status}`);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status, code: status, message: `status ${status}` });
    expect(isApiNotFound(error)).toBe(true);
  });

  test('HTTP 500 is an error, not "not found"', async () => {
    const error = await failure(`${base}/500`);
    expect(error).toMatchObject({ status: 500 });
    expect(isApiNotFound(error)).toBe(false);
  });

  test('a network error still rejects with an ApiError (it used to reject with undefined)', async () => {
    const error = await failure('http://127.0.0.1:9/unreachable');
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBeUndefined();
    expect(isApiNotFound(error)).toBe(false);
  });
});
