// CON-15 A7: scripts/postcss-hover-media.js puts every hand-written :hover rule inside @media (hover: hover), splitting a
// selector list that mixes :hover with other selectors, and leaves rules already inside a hover media query alone.
import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const plugin = require('../scripts/postcss-hover-media.js');
const run = (css) =>
  postcss([plugin])
    .process(css, { from: undefined })
    .then((r) => r.css);

describe('postcss hover media', () => {
  test('a :hover rule moves inside @media (hover: hover)', async () => {
    expect(await run('.a:hover{color:red}')).toBe('@media (hover: hover){.a:hover{color:red}}');
  });

  test('a mixed selector list is split: the other selectors stay at rest', async () => {
    expect(await run('.a.on,.a:hover{width:1px}')).toBe('.a.on{width:1px}@media (hover: hover){.a:hover{width:1px}}');
  });

  test('nested rules are wrapped in place', async () => {
    expect(await run('.n{&.on,&:hover{&::after{width:50%}}}')).toBe(
      '.n{&.on{&::after{width:50%}}@media (hover: hover){&:hover{&::after{width:50%}}}}',
    );
  });

  test('rules already inside a hover media query, and rules without :hover, are left alone', async () => {
    const css = '@media (hover: hover) and (pointer: fine){.b:hover{color:red}}.c{color:blue}';
    expect(await run(css)).toBe(css);
  });

  test('is idempotent', async () => {
    const once = await run('.a:hover,.a:focus{color:red}');
    expect(await run(once)).toBe(once);
  });
});
