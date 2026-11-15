// PERF-10: the browser Sentry SDK loads lazily. Captures made before it loads are queued and sent once it has
// initialised; uncaught errors are queued by the module's own listeners until then; builds with Sentry off load nothing.
import { afterEach, describe, expect, test, vi } from 'vitest';

const captured = vi.hoisted(() => []);
const inits = vi.hoisted(() => ({ count: 0 }));
vi.mock('@/lib/sentry-init', () => {
  inits.count += 1;
  return { Sentry: { captureException: (e, hint) => captured.push({ e, hint }), captureRouterTransitionStart: () => {} } };
});

function fakeWindow() {
  const listeners = {};
  globalThis.window = {
    addEventListener: (type, fn) => (listeners[type] ??= new Set()).add(fn),
    removeEventListener: (type, fn) => listeners[type]?.delete(fn),
    requestIdleCallback: () => 0,
  };
  globalThis.document = { readyState: 'complete' };
  return listeners;
}

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
  captured.length = 0;
  vi.resetModules();
  vi.doUnmock('@/lib/sentry-options');
});

describe('lazy Sentry', () => {
  test('a capture before the SDK loads is queued, loads it, and is sent once it has initialised', async () => {
    fakeWindow();
    vi.doMock('@/lib/sentry-options', () => ({ sentryBaseOptions: { enabled: true } }));
    const client = await import('@/lib/sentry-client');
    client.captureException(new Error('early'));
    expect(captured).toEqual([]);
    await client.loadSentry();
    expect(captured.map((c) => c.e.message)).toEqual(['early']);
    client.captureException(new Error('late'));
    expect(captured.map((c) => c.e.message)).toEqual(['early', 'late']);
  });

  test('uncaught errors are queued by its listeners until the SDK takes over, then the listeners go', async () => {
    const listeners = fakeWindow();
    vi.doMock('@/lib/sentry-options', () => ({ sentryBaseOptions: { enabled: true } }));
    const client = await import('@/lib/sentry-client');
    client.startSentry();
    const [onError] = listeners.error;
    onError({ error: new Error('boom'), message: 'boom' });
    await client.loadSentry();
    expect(captured[0].e.message).toBe('boom');
    expect(captured[0].hint).toEqual({ mechanism: { type: 'onerror', handled: false } });
    expect(listeners.error.size).toBe(0);
    expect(listeners.unhandledrejection.size).toBe(0);
  });

  test('with Sentry off nothing is queued or loaded', async () => {
    const listeners = fakeWindow();
    vi.doMock('@/lib/sentry-options', () => ({ sentryBaseOptions: { enabled: false } }));
    const before = inits.count;
    const client = await import('@/lib/sentry-client');
    client.startSentry();
    client.captureException(new Error('dropped'));
    expect(await client.loadSentry()).toBeNull();
    expect(listeners.error).toBeUndefined();
    expect(captured).toEqual([]);
    expect(inits.count).toBe(before);
  });
});
