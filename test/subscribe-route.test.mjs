// ENG-09: POST /api/subscribe validates, drops honeypot hits, rate limits, verifies Turnstile when configured and maps
// Mailchimp's answers to typed results. Mailchimp and Cloudflare are fakes here: no test ever reaches either.
import { describe, expect, test, vi } from 'vitest';
import { handleSubscribe } from '@/app/api/subscribe/handler';
import { parseSubscribeAnswer } from '@/lib/newsletter/result';

const post = (body, headers = {}) =>
  new Request('http://local/api/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const jsonp = (obj) => new Response(`cb(${JSON.stringify(obj)})`, { status: 200 });
const run = async (body, { upstream, env = {}, allow = () => true } = {}) => {
  const fetchImpl = vi.fn(
    upstream ?? (async () => jsonp({ result: 'success', msg: 'Almost finished... We need to confirm your email address.' })),
  );
  const res = await handleSubscribe(post(body), { env, fetchImpl, allow, log: () => {} });
  return { status: res.status, body: await res.json(), fetchImpl };
};

describe('POST /api/subscribe', () => {
  test('an invalid address is a 400 invalid_email and nothing is sent upstream', async () => {
    const r = await run({ email: 'not-an-address', placement: 'nav' });
    expect(r).toMatchObject({ status: 400, body: { ok: false, code: 'invalid_email' } });
    expect(r.fetchImpl).not.toHaveBeenCalled();
  });

  test('a filled honeypot is answered like a success and dropped silently', async () => {
    const r = await run({ email: 'someone@example.invalid', website: 'http://spam', placement: 'nav' });
    expect(r).toMatchObject({ status: 200, body: { ok: true } });
    expect(r.fetchImpl).not.toHaveBeenCalled();
  });

  test('a non-JSON body is refused', async () => {
    const res = await handleSubscribe(new Request('http://local/api/subscribe', { method: 'POST', body: 'EMAIL=x' }), {
      log: () => {},
    });
    expect(res.status).toBe(415);
  });

  test('public endpoint: double opt-in answer is pending, the address goes only to Mailchimp', async () => {
    const r = await run({ email: 'someone@example.invalid', placement: 'connect' });
    expect(r).toMatchObject({ status: 200, body: { ok: true, code: 'pending' } });
    const url = new URL(r.fetchImpl.mock.calls[0][0]);
    expect(url.host).toBe('life.us11.list-manage.com');
    expect(url.searchParams.get('id')).toBe('af9154d6b5');
    expect(url.searchParams.get('f_id')).toBe('00e418e1f0');
    expect([...url.searchParams.keys()].some((k) => k.startsWith('amp;'))).toBe(false);
  });

  test('public endpoint: "already subscribed" maps to already_subscribed', async () => {
    const r = await run(
      { email: 'someone@example.invalid' },
      {
        upstream: async () =>
          jsonp({ result: 'error', msg: 'someone@example.invalid is already subscribed to list Longevity.' }),
      },
    );
    expect(r).toMatchObject({ status: 200, body: { ok: true, code: 'already_subscribed' } });
  });

  test('Marketing API: "Member Exists" maps to already_subscribed, a new member is pending', async () => {
    const env = { MAILCHIMP_API_KEY: 'fake-us11', MAILCHIMP_LIST_ID: 'list1' };
    const exists = await run(
      { email: 'someone@example.invalid' },
      { env, upstream: async () => new Response(JSON.stringify({ title: 'Member Exists', status: 400 }), { status: 400 }) },
    );
    expect(exists.body).toMatchObject({ ok: true, code: 'already_subscribed' });
    const created = await run(
      { email: 'someone@example.invalid' },
      { env, upstream: async () => new Response(JSON.stringify({ status: 'pending' }), { status: 200 }) },
    );
    expect(created.body).toMatchObject({ ok: true, code: 'pending' });
    const [url, init] = created.fetchImpl.mock.calls[0];
    expect(url).toBe('https://us11.api.mailchimp.com/3.0/lists/list1/members');
    expect(JSON.parse(init.body)).toEqual({ email_address: 'someone@example.invalid', status: 'pending' });
  });

  test('an upstream timeout or network failure maps to upstream_error (502)', async () => {
    const r = await run(
      { email: 'someone@example.invalid' },
      {
        upstream: async () => {
          throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
        },
      },
    );
    expect(r).toMatchObject({ status: 502, body: { ok: false, code: 'upstream_error' } });
  });

  test('the rate limit answers 429 rate_limited before contacting anyone', async () => {
    const r = await run({ email: 'someone@example.invalid' }, { allow: () => false });
    expect(r).toMatchObject({ status: 429, body: { ok: false, code: 'rate_limited' } });
    expect(r.fetchImpl).not.toHaveBeenCalled();
  });

  test('with a Turnstile secret, a missing or rejected token is a 403 spam_check', async () => {
    const env = { TURNSTILE_SECRET: 'secret' };
    const missing = await run({ email: 'someone@example.invalid' }, { env });
    expect(missing).toMatchObject({ status: 403, body: { code: 'spam_check' } });
    const rejected = await run(
      { email: 'someone@example.invalid', token: 'tok' },
      { env, upstream: async () => new Response(JSON.stringify({ success: false })) },
    );
    expect(rejected).toMatchObject({ status: 403, body: { code: 'spam_check' } });
  });
});

describe('the browser side of the answer', () => {
  test('unknown or malformed answers become a generic error with a message', () => {
    expect(parseSubscribeAnswer({ ok: true, code: 'subscribed' })).toEqual({ ok: true, code: 'subscribed' });
    expect(parseSubscribeAnswer(null)).toMatchObject({ ok: false, code: 'error' });
    expect(parseSubscribeAnswer({ ok: false, code: 'nonsense' })).toMatchObject({ ok: false, code: 'error' });
    expect(parseSubscribeAnswer({ ok: false, code: 'invalid_email', message: 'Bad' })).toEqual({
      ok: false,
      code: 'invalid_email',
      message: 'Bad',
    });
  });
});
