// The error-state test hook (src/components/common/ForcedError.tsx): in a non-production build ?force-error=<where>
// makes the copy at <where> throw (it reads the router's query, so a client navigation counts as well as a first load);
// in a production build the component renders nothing whatever the address.
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';

let search = '';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(search) }));

const render = async (env, query) => {
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ENV', env);
  search = query;
  vi.resetModules();
  const { default: ForcedError } = await import('@/components/common/ForcedError');
  // The server renderer turns an error inside a Suspense boundary into its fallback (the browser renders it), so the
  // boundary's content, the thrower, is rendered directly.
  const tree = ForcedError({ where: 'route' });
  return () => (tree === null ? '' : renderToStaticMarkup(tree.props.children));
};

describe('force-error test hook', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
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
