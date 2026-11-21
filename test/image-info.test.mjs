// SEO-07: the link-preview picture's size and type are read from the file's first bytes (PNG, JPEG, WebP lossy,
// lossless and extended); anything else, or a failed read, declares nothing.
import sharp from 'sharp';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { parseImageHeader, readImageInfo } from '@/lib/seo/image-info';

const make = (format, options = {}) =>
  sharp({ create: { width: 1280, height: 723, channels: 3, background: { r: 200, g: 20, b: 20 } } })
    [format](options)
    .toBuffer();

describe('picture size from the file header', () => {
  afterEach(() => vi.unstubAllGlobals());

  test.each([
    ['png', {}, 'image/png'],
    ['jpeg', {}, 'image/jpeg'],
    ['webp', {}, 'image/webp'],
    ['webp', { lossless: true }, 'image/webp'],
  ])('%s %o', async (format, options, type) => {
    expect(parseImageHeader(new Uint8Array(await make(format, options)))).toEqual({ width: 1280, height: 723, type });
  });

  test('an extended WebP (with alpha) reads from its VP8X header', async () => {
    const buffer = await sharp({ create: { width: 640, height: 640, channels: 4, background: '#c01010aa' } })
      .webp()
      .toBuffer();
    expect(parseImageHeader(new Uint8Array(buffer))).toEqual({ width: 640, height: 640, type: 'image/webp' });
  });

  test('a file of another kind, or a failed read, declares nothing', async () => {
    expect(parseImageHeader(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
    vi.stubGlobal('fetch', async () => new Response('nope', { status: 404 }));
    expect(await readImageInfo('https://cdn.test/a.webp', 300)).toBeNull();
    vi.stubGlobal('fetch', async () => {
      throw new Error('offline');
    });
    expect(await readImageInfo('https://cdn.test/a.webp', 300)).toBeNull();
  });

  test('a ranged read of the first bytes is enough', async () => {
    const full = await make('jpeg');
    let range;
    vi.stubGlobal('fetch', async (url, init) => {
      range = init.headers.Range;
      return new Response(full.subarray(0, 4096), { status: 206 });
    });
    expect(await readImageInfo('https://cdn.test/a.jpg', 300)).toEqual({ width: 1280, height: 723, type: 'image/jpeg' });
    expect(range).toBe('bytes=0-65535');
  });
});
