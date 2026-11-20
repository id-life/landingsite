// src/lib/server-chunk-retry.ts: before webpack reuses a chunk's <script> tag from the HTML, a tag whose download has
// ended without installing the chunk (it failed) is removed so webpack fetches it again; a tag still downloading, and
// webpack's own tags, are left alone. Fakes stand in for the document, Resource Timing and webpack's loader.
import { afterEach, describe, expect, test, vi } from 'vitest';
import { retryFailedServerChunks } from '@/lib/server-chunk-retry';

class FakeScript {
  constructor(src, attrs = {}) {
    this.src = `https://site.test${src}`;
    this.attrs = { src, ...attrs };
    this.removed = false;
  }
  getAttribute(name) {
    return this.attrs[name] ?? null;
  }
  hasAttribute(name) {
    return name in this.attrs;
  }
  remove() {
    this.removed = true;
  }
}

const setup = ({ tags, ended = [] }) => {
  vi.stubGlobal('HTMLScriptElement', FakeScript);
  let onError;
  const doc = {
    getElementsByTagName: () => tags.filter((t) => !t.removed),
    addEventListener: (type, fn) => {
      if (type === 'error') onError = fn;
    },
  };
  const perf = { getEntriesByName: (name) => (ended.includes(name) ? [{ name }] : []) };
  const calls = [];
  const runtime = {
    l: (url, done, key, chunkId) =>
      calls.push({ url, key, chunkId, seen: tags.filter((t) => !t.removed && t.getAttribute('src') === url).length }),
  };
  retryFailedServerChunks(runtime, doc, perf);
  return { runtime, calls, fail: (tag) => onError({ target: tag }) };
};

describe('failed server-listed chunk tags', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('a tag whose download already ended is removed before webpack looks for it', () => {
    const tag = new FakeScript('/_next/static/chunks/app/news/page-a.js');
    const { runtime, calls } = setup({ tags: [tag], ended: [tag.src] });
    runtime.l('/_next/static/chunks/app/news/page-a.js', () => {}, 'chunk-1', 1);
    expect(tag.removed).toBe(true);
    expect(calls).toEqual([{ url: '/_next/static/chunks/app/news/page-a.js', key: 'chunk-1', chunkId: 1, seen: 0 }]);
  });

  test('a tag that failed after the wrapper ran is known from its error event', () => {
    const tag = new FakeScript('/_next/static/chunks/70-a.js');
    const { runtime, fail } = setup({ tags: [tag] });
    fail(tag);
    runtime.l('/_next/static/chunks/70-a.js', () => {}, 'chunk-70', 70);
    expect(tag.removed).toBe(true);
  });

  test('a tag still downloading is reused, so nothing is fetched twice', () => {
    const tag = new FakeScript('/_next/static/chunks/70-a.js');
    const { runtime, calls } = setup({ tags: [tag] });
    runtime.l('/_next/static/chunks/70-a.js', () => {}, 'chunk-70', 70);
    expect(tag.removed).toBe(false);
    expect(calls[0].seen).toBe(1);
  });

  test("webpack's own tags and other addresses are left to webpack", () => {
    const own = new FakeScript('/_next/static/chunks/3139.a.js', { 'data-webpack': '_N_E:chunk-3139' });
    const other = new FakeScript('/_next/static/chunks/other.js');
    const { runtime } = setup({ tags: [own, other], ended: [own.src, other.src] });
    runtime.l('/_next/static/chunks/3139.a.js', () => {}, 'chunk-3139', 3139);
    expect(own.removed).toBe(false);
    expect(other.removed).toBe(false);
  });

  test('wraps once, and leaves a runtime without a script loader alone', () => {
    const { runtime } = setup({ tags: [] });
    const first = runtime.l;
    retryFailedServerChunks(runtime, { addEventListener: () => {} }, {});
    expect(runtime.l).toBe(first);
    expect(() => retryFailedServerChunks({}, {}, {})).not.toThrow();
    expect(() => retryFailedServerChunks(undefined, {}, {})).not.toThrow();
  });
});
