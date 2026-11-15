// PERF-01: the image-optimizer switch. A Vercel build must not turn on Vercel Image Optimization (metered, not
// approved) unless NEXT_PUBLIC_IMAGE_OPTIMIZER says so; the cdn loader rewrites only CMS covers.
import { afterEach, describe, expect, test, vi } from 'vitest';
import imageLoader, { coverUrl } from '@/lib/image-loader';

const ENV = { ...process.env };
afterEach(() => {
  process.env = { ...ENV };
  vi.resetModules();
});

async function config(env) {
  for (const key of ['VERCEL', 'NEXT_PUBLIC_IMAGE_OPTIMIZER', 'NEXT_PUBLIC_COVER_LOADER_TEMPLATE']) delete process.env[key];
  Object.assign(process.env, env);
  vi.resetModules();
  return (await import('../next.config.mjs')).default;
}

describe('next.config images', () => {
  test('a Vercel build serves images as stored by default (nothing billed)', async () => {
    const c = await config({ VERCEL: '1' });
    expect(c.images.unoptimized).toBe(true);
    expect(c.env.NEXT_PUBLIC_IMAGE_OPTIMIZER).toBe('off');
  });

  test('a self-hosted build keeps the built-in optimizer', async () => {
    const c = await config({});
    expect(c.images.unoptimized).toBeUndefined();
    expect(c.images.loader).toBeUndefined();
    expect(c.env.NEXT_PUBLIC_IMAGE_OPTIMIZER).toBe('next');
  });

  test('the owner can opt in to Vercel Image Optimization or a custom loader', async () => {
    expect((await config({ VERCEL: '1', NEXT_PUBLIC_IMAGE_OPTIMIZER: 'next' })).images.unoptimized).toBeUndefined();
    const cdn = await config({ VERCEL: '1', NEXT_PUBLIC_IMAGE_OPTIMIZER: 'cdn' });
    expect(cdn.images).toMatchObject({ loader: 'custom', loaderFile: './src/lib/image-loader.ts' });
  });

  test('an unknown value fails the build', async () => {
    await expect(config({ NEXT_PUBLIC_IMAGE_OPTIMIZER: 'vercel-maybe' })).rejects.toThrow(/off, next or cdn/);
  });
});

describe('cover loader', () => {
  const cover = 'https://cdn.id.life/id-platform-io/node_cover/e3dfb7bd.png';

  test('fills the template for CMS covers', () => {
    expect(coverUrl('https://cdn.id.life{path}?w={width}&q={quality}', cover, 640, 70)).toBe(
      'https://cdn.id.life/id-platform-io/node_cover/e3dfb7bd.png?w=640&q=70',
    );
    expect(coverUrl('https://img.example/?url={src}&w={width}', cover, 320)).toBe(
      `https://img.example/?url=${encodeURIComponent(cover)}&w=320`,
    );
  });

  test('leaves every other image, and every image without a template, as stored', () => {
    expect(coverUrl('https://x/{path}?w={width}', '/imgs/news/insights-bg.webp', 640)).toBeNull();
    expect(coverUrl('https://x/{path}?w={width}', 'https://img.youtube.com/vi/a/hqdefault.jpg', 640)).toBeNull();
    expect(coverUrl('', cover, 640)).toBeNull();
    expect(imageLoader({ src: '/imgs/a.png', width: 640 })).toBe('/imgs/a.png');
  });
});
