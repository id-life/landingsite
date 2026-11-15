// PERF-05: every particle logo the Portfolio and Spectrum sketches draw has precomputed points
// (scripts/precompute-particles.mjs), so no stencil image is downloaded at run time. A changed image or parameter
// fails here until the script is re-run.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { portfolioGetSourceImgInfos } from '@/app/portfolio/_components/portfolioData';
import { spectrumGetSourceImgInfos } from '@/hooks/spectrum/useSpectrumData';
import { particleKey } from '@/components/gl/particle/particle-key.mjs';

const manifest = JSON.parse(readFileSync(new URL('../src/components/gl/particle/particle-points.json', import.meta.url)));

const sets = [
  ['dynamic', false, portfolioGetSourceImgInfos(false)],
  ['dynamic', true, portfolioGetSourceImgInfos(true)],
  ['static', false, spectrumGetSourceImgInfos(false)],
  ['static', true, spectrumGetSourceImgInfos(true)],
];

describe('precomputed particle points', () => {
  it.each(sets)('%s sketches (phone: %s) find every logo in the manifest', (kind, mobile, sources) => {
    const missing = sources.filter((source) => !manifest[particleKey(kind, mobile, source)]).map((s) => s.url);
    expect(missing).toEqual([]);
  });

  it('every manifest entry points at a file that exists and holds that image', () => {
    for (const { file, index } of Object.values(manifest)) {
      const path = new URL(`../public${file}`, import.meta.url);
      expect(existsSync(path), file).toBe(true);
      const buffer = readFileSync(path);
      expect(buffer.readUInt32LE(0), file).toBeGreaterThan(index);
      expect(statSync(path).size, file).toBeGreaterThan(4);
    }
  });
});
