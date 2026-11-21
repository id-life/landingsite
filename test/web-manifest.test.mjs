// ENG-17: the manifest names the site as its title does, uses his description and his symbol; every icon it lists is
// a file in public/ of the declared size and type; icon.svg is his logo.svg unchanged.
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, test } from 'vitest';
import manifest from '@/app/manifest';
import { ORG_DESCRIPTION } from '@/constants/entity';

describe('web app manifest', () => {
  const m = manifest();

  test('his name, description and colours; opens like a tab', () => {
    expect(m.name).toBe('Immortal Dragons 不朽真龙');
    expect(m.description).toBe(ORG_DESCRIPTION);
    expect(m.display).toBe('browser');
    expect(m.theme_color).toBe('#f0f0f0');
  });

  test('every icon is a file of its declared size and type', async () => {
    for (const icon of m.icons) {
      const file = `public${icon.src}`;
      if (icon.type === 'image/svg+xml') {
        expect(readFileSync(file)).toEqual(readFileSync('public/svgs/logo.svg'));
        continue;
      }
      const meta = await sharp(file).metadata();
      expect(`${meta.width}x${meta.height}`, file).toBe(icon.sizes);
      expect(`image/${meta.format}`, file).toBe(icon.type);
      expect(meta.hasAlpha, file).toBe(false);
    }
  });
});
