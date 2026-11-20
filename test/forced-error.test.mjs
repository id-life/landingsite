// The error-state test hook: src/components/common/ForcedError.tsx throws at the asked place only; its gate
// (ForcedErrorGate.tsx) loads it only when the address asks; every placement requires the gate behind the compile-time
// production check, never with a static import, so a production build drops it (its chunks are searched separately).
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';

describe('force-error test hook', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  test('the hook throws at the asked place, and only there', async () => {
    const { default: ForcedError } = await import('@/components/common/ForcedError');
    const render = (search) => {
      vi.stubGlobal('window', { location: { search } });
      return () => renderToStaticMarkup(createElement(ForcedError, { where: 'route' }));
    };
    expect(render('?force-error=route')).toThrow('force-error test hook: route');
    expect(render('?force-error=global')()).toBe('');
    expect(render('')()).toBe('');
  });

  test('each placement requires the gate behind the production check, and nothing imports it statically', () => {
    const PLACES = {
      'src/app/layout.tsx': ['root', 'global'],
      'src/app/(home)/layout.tsx': ['home', 'route'],
      'src/app/news/layout.tsx': ['news', 'route'],
      'src/app/(home)/_components/HomeEntry.tsx': [null, 'section'],
    };
    for (const [file, [own, where]] of Object.entries(PLACES)) {
      const src = readFileSync(file, 'utf8');
      const gate = own ? `forced-error-gate/${own}` : 'ForcedErrorGate';
      expect(src, file).toMatch(
        new RegExp(
          `process\\.env\\.NEXT_PUBLIC_DEPLOY_ENV === 'production'\\s*\\?\\s*null[\\s\\S]{0,200}require\\('@/components/common/${gate}'\\)`,
        ),
      );
      expect(src, file).toMatch(new RegExp(`where="${where}"`));
      expect(src, file).not.toMatch(/^import (?!type )[^;]*(ForcedError|forced-error-gate)/m);
    }
  });

  test('the gate imports the hook only on demand, with no router state or Suspense boundary', () => {
    const gate = readFileSync('src/components/common/ForcedErrorGate.tsx', 'utf8').replace(/\/\*\*[\s\S]*?\*\//g, '');
    expect(gate).toMatch(/location\.search\.includes\('force-error'\)/);
    expect(gate).toMatch(/import\('\.\/ForcedError'\)/);
    expect(gate).not.toMatch(/useSearchParams|Suspense/);
  });
});
