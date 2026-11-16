// RWD-01: scripts/postcss-layout-unit.js turns rem into the layout unit (--u) and, for text, the type unit (--t), with no
// floor (the owner's rule on font sizes: text keeps the original's size). Custom properties (the type roles) stay rem, and a converted value is never converted again (PostCSS
// revisits changed declarations; a loop here once hung the build).
import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const plugin = require('../scripts/postcss-layout-unit.js');
const run = (css) =>
  postcss([plugin])
    .process(css, { from: undefined })
    .then((r) => r.css);

describe('postcss layout unit', () => {
  test('layout lengths become --u, text sizes --t without a floor, custom properties stay rem', async () => {
    expect(await run('a{margin:2rem calc(100% - 1rem);font-size:.875rem;line-height:1.25rem;--type-x:1rem}')).toBe(
      'a{margin:calc(var(--u) * 2) calc(100% - calc(var(--u) * 1));font-size:calc(var(--t) * .875);line-height:calc(var(--t) * 1.25);--type-x:1rem}',
    );
  });

  test('is idempotent', async () => {
    const once = await run('a{font-size:1.5rem;padding:-0.25rem}');
    expect(await run(once)).toBe(once);
  });
});
