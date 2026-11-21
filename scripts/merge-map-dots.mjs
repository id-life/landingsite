#!/usr/bin/env node
// The Presence map's dots as one path (MOT-11). public/svgs/engagement/world-map.svg draws 3,085 equal circles (one
// radius, one fill, none touching another); as DOM nodes they cost the page 3,085 elements, and the hover spotlight
// copied them all. This writes public/svgs/engagement/world-map-path.svg: the same viewBox and fill, and one path
// with one closed circle (two half arcs) per dot, at the same centre and radius. As no two dots overlap, the path
// covers exactly the pixels the circles did.
// Re-run after changing the map: node scripts/merge-map-dots.mjs (test/world-map-path.test.mjs checks the result).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const num = (value) => (value === undefined ? 0 : Number(value));
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** The original's circles: centre, radius and fill (a missing cx or cy is 0, as in SVG). */
export function circlesOf(svg) {
  return [...svg.matchAll(/<circle\b[^>]*>/g)].map(([tag]) => ({
    cx: num(attr(tag, 'cx')),
    cy: num(attr(tag, 'cy')),
    r: num(attr(tag, 'r')),
    fill: attr(tag, 'fill'),
  }));
}

const fmt = (n) => String(Math.round(n * 1e6) / 1e6).replace(/^(-?)0\./, '$1.');

/** The same picture with every circle as a subpath of one path. */
export function dotsPathSvg(svg) {
  const circles = circlesOf(svg);
  const fills = new Set(circles.map((c) => c.fill));
  if (fills.size !== 1) throw new Error(`expected one fill, found ${[...fills].join(', ')}`);
  const viewBox = svg.match(/<svg\b[^>]*\sviewBox="([^"]*)"/)?.[1];
  if (!viewBox) throw new Error('no viewBox');
  const d = circles
    .map(
      ({ cx, cy, r }) =>
        `M${fmt(cx - r)} ${fmt(cy)}a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${[...fills][0]}" d="${d}"/></svg>\n`;
}

/** Centre and radius of every subpath written by dotsPathSvg (for the test). */
export function subpathCentres(svg) {
  const d = svg.match(/\sd="([^"]*)"/)[1];
  return [...d.matchAll(/M(-?[\d.]+) (-?[\d.]+)a(-?[\d.]+) [^a]*a[^M]*/g)].map(([, x, y, r]) => ({
    cx: Math.round((Number(x) + Number(r)) * 1e6) / 1e6,
    cy: Number(y),
    r: Number(r),
  }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'svgs', 'engagement');
  const out = dotsPathSvg(readFileSync(join(dir, 'world-map.svg'), 'utf8'));
  writeFileSync(join(dir, 'world-map-path.svg'), out);
  console.log(
    `world-map-path.svg: ${circlesOf(readFileSync(join(dir, 'world-map.svg'), 'utf8')).length} dots, ${out.length} bytes`,
  );
}
