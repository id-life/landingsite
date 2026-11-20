// The error-state test hook (src/components/common/ForcedError.tsx): in a non-production build ?force-error=<where>
// makes the copy at <where> throw; in a production build the component renders nothing whatever the address.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';

const render = async (env, search) => {
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ENV', env);
  vi.stubGlobal('window', { location: { search } });
  vi.resetModules();
  const { default: ForcedError } = await import('@/components/common/ForcedError');
  return () => renderToStaticMarkup(createElement(ForcedError, { where: 'route' }));
};

describe('force-error test hook', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test('a UAT build throws at the asked place, and only there', async () => {
    expect(await render('uat', '?force-error=route')).toThrow('force-error test hook: route');
    expect((await render('uat', '?force-error=global'))()).toBe('');
    expect((await render('uat', ''))()).toBe('');
  });

  test('a production build never throws, whatever the address', async () => {
    expect((await render('production', '?force-error=route'))()).toBe('');
  });
});
