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

  test('on a very wide window the gaps start to give exactly where the media query does', () => {
    const wide = css.match(
      /@media \(min-width: 1920px\) and \(max-height: calc\(2 \* \(([\d.]+) \+ ([\d.]+) \+ ([\d.]+)\) \* ([\d.]+)vw\)\)/,
    );
    expect(wide, 'the wide-window media query in globals.css').not.toBeNull();
    const [, above, nav, gap, unit] = wide;
    // The give is 0 at the media query's edge: (above + nav + gap) units less half the window.
    expect(css).toContain(`calc((var(--u) * (${above} + ${nav} + ${gap}) - 50vh) * 2 / 0.85)`);
    expect(unit).toBe(desktopUnit?.[1]);
    // 0.85 is his wrapper scale from 1920 px wide (desktop2k).
    expect(Number(tailwind.match(/desktop2k: \{ min: '(\d+)px' \}/)?.[1])).toBe(1920);
    expect(readFileSync(new URL('../src/app/insights/Insights.tsx', import.meta.url), 'utf8')).toContain(
      'desktop2k:scale-[0.85]',
    );
  });
});
