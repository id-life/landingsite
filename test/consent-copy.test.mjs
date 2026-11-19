// The consent banner and the "Privacy choices" link render only approved copy: the draft text is one the owner has
// not seen, so with the switch off no build shows it (his answer on legal pages, question 20: "not needed for now").
import { afterEach, describe, expect, test, vi } from 'vitest';

describe('consent copy', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  for (const env of ['production', 'uat', 'development']) {
    test(`a ${env} build renders no draft consent copy`, async () => {
      vi.stubEnv('NEXT_PUBLIC_DEPLOY_ENV', env);
      vi.stubEnv('DEPLOY_ENV', env);
      const { CONSENT_COPY, SHOW_DRAFT_CONSENT_COPY, canRenderConsentCopy } = await import('@/lib/analytics/consent-copy');
      expect(CONSENT_COPY.status).toBe('draft');
      expect(SHOW_DRAFT_CONSENT_COPY).toBe(false);
      expect(canRenderConsentCopy()).toBe(false);
    });
  }
});
