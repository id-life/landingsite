// Unit tests (npm test). Node environment: they exercise data, URL and markdown modules, and render React to
// static HTML where a test needs markup. Browser behaviour is covered by the Playwright suite in idlife-audit.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  esbuild: { jsx: 'automatic' },
  test: { include: ['test/**/*.test.mjs'], environment: 'node' },
});
