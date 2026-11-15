// NAV-16: every shareable Spectrum / Presence hash link opens the section it names and an existing map dot.
import { describe, expect, test, vi } from 'vitest';
import { NAV, NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS } from '@/constants/engagement';
import { SPECTRUM_HASH_ROUTES } from '@/hooks/spectrum/spectrum-routes';

// engagement.tsx draws country flags from the SVG barrel (svgr imports); the test only reads the dot data.
vi.mock('@/components/svg', () => {
  const Stub = () => null;
  return {
    AmericaSVG: Stub,
    ChineseSVG: Stub,
    HondurasSVG: Stub,
    SingaporeSVG: Stub,
    ThailandSVG: Stub,
    DenmarkSVG: Stub,
    FranceSVG: Stub,
  };
});

const DOTS = { meeting: WORLD_MAP_DOTS, book: MAP_BOOK_DOTS, sponsor: MAP_SPONSOR_DOTS };

/** Every text a dot shows (titles, labels, item captions), whitespace collapsed; image and link URLs left out. */
function textsOf(value, out = []) {
  if (typeof value === 'string') {
    if (!/^https?:\/\/|\.(webp|png|jpe?g|webm|mp4)$/i.test(value)) out.push(value.replace(/\s+/g, ' ').trim());
  } else if (Array.isArray(value)) value.forEach((v) => textsOf(v, out));
  else if (value && typeof value === 'object' && !value.$$typeof) Object.values(value).forEach((v) => textsOf(v, out));
  return out;
}

describe('NAV', () => {
  test('holds every section of NAV_LIST under its own id', () => {
    expect(Object.keys(NAV).sort()).toEqual(NAV_LIST.map((item) => item.id).sort());
    for (const item of NAV_LIST) expect(NAV[item.id]).toBe(item);
  });

  test('names the sections the hash links rely on', () => {
    expect(NAV.engagement_page.href).toBe('/presence');
    expect(NAV.twin_page.href).toBe('/digitaltwin');
  });
});

describe('Spectrum hash routes', () => {
  test('keep all 19 shared keys, each once', () => {
    const keys = SPECTRUM_HASH_ROUTES.map((route) => route.key);
    expect(keys).toHaveLength(19);
    expect(new Set(keys).size).toBe(keys.length);
  });

  for (const route of SPECTRUM_HASH_ROUTES) {
    test(`#${route.key} opens ${route.section}${route.dot ? ` and ${route.dot.type} dot ${route.dot.index}` : ''}`, () => {
      const section = NAV[route.section];
      expect(section, `section ${route.section}`).toBeDefined();
      // The address the link lives at is the address of the section it opens (no rewrite to another path).
      expect(route.pathname ?? '/presence').toBe(section.href);
      if (!route.dot) return;
      const dots = DOTS[route.dot.type];
      expect(route.dot.index, `${route.dot.type} dots: ${dots.length}`).toBeLessThan(dots.length);
      expect(route.dot.index).toBeGreaterThanOrEqual(0);
      const texts = textsOf(dots[route.dot.index]);
      expect(
        texts.some((text) => text.includes(route.dot.shows)),
        `dot ${route.dot.type} ${route.dot.index} shows ${JSON.stringify(texts.slice(0, 6))}`,
      ).toBe(true);
    });
  }
});
