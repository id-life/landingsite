// RWD-03: Insights on a short laptop window (globals.css). The column's text height is written twice, in the media
// query that limits the fit to windows where his column does not fit, and in --insights-text that the fit computes
// with; a media query cannot read a custom property. If the two drift apart the fit either switches on where the
// column fits (and changes pixels there) or stays off where it does not. The text height itself is tied to the news
// feed (the tallest news page's cards) and is re-measured on the page, not here.
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const css = readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
const gate = css.match(
  /@media \(max-width: ([\d.]+)px\) and \(max-height: calc\(\(([\d.]+) \+ ([\d.]+)\) \* ([\d.]+)vw \+ (\d+)px\)\)/,
);
const style = readFileSync(new URL('../src/app/(home)/_components/Style.tsx', import.meta.url), 'utf8');
const desktopUnit = style.match(/--u: ([\d.]+)vw;/);
const tailwind = readFileSync(new URL('../tailwind.config.ts', import.meta.url), 'utf8');
const desktopMin = tailwind.match(/desktop: \{ min: '(\d+)px' \}/);
const unitsOf = (name) => css.match(new RegExp(`${name}: calc\\(var\\(--u\\) \\* ([\\d.]+)\\)`))?.[1];

describe('Insights short-laptop fit', () => {
  test('the media query and the fit use the same text height, bands and unit', () => {
    expect(gate, 'the fit media query in globals.css').not.toBeNull();
    const [, maxWidth, text, bands, unit, slogan] = gate;
    expect(text).toBe(unitsOf('--insights-text'));
    expect(css).toContain(`--insights-room: calc(100vh - var(--u) * ${bands} - ${slogan}px);`);
    expect(unit).toBe(desktopUnit?.[1]);
    // Below the width where the wrapper takes his own laptop scale (desktop:scale-[0.95]), which the fit ignores.
    expect(Number(maxWidth)).toBeLessThan(Number(desktopMin?.[1]));
  });

  test('the whole fit sits behind that media query', () => {
    const at = css.indexOf(gate[0]);
    const before = css.slice(0, at);
    expect(before).not.toMatch(/\.insights-fit\s*\{/);
    expect(before).not.toMatch(/--insights-[\w-]+:/);
  });
});
