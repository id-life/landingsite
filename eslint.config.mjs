// ESLint flat config (ESLint 9). next lint is gone in Next 16, so this runs through the ESLint CLI: npm run lint.
// Migrated from .eslintrc.json with the same rules (https://nextjs.org/docs/app/api-reference/config/eslint).
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const restrictedSyntax = [
  {
    selector: "MemberExpression[object.name='NAV_LIST'][computed=true][property.type='Literal']",
    message:
      "Look a section up by id (NAV.engagement_page from '@/components/nav/nav'), not by its position in NAV_LIST: positions change when sections are reordered.",
  },
  {
    selector: "CallExpression[callee.object.name='window'][callee.property.name='open'] > Literal:first-child[value=/^\\//]",
    message: 'Link to this site with <a href> or next/link (same tab; Cmd-click still opens a new tab), not window.open.',
  },
  {
    selector:
      "CallExpression[callee.object.name='window'][callee.property.name='open'] > TemplateLiteral:first-child[quasis.0.value.raw=/^\\//]",
    message: 'Link to this site with <a href> or next/link (same tab; Cmd-click still opens a new tab), not window.open.',
  },
  {
    selector:
      "JSXOpeningElement:has(JSXAttribute[name.name='target'][value.value='_blank']):has(JSXAttribute[name.name='href'][value.value=/^\\//])",
    message: 'Pages of this site open in the same tab: drop target=_blank from internal links.',
  },
  {
    selector:
      "JSXOpeningElement:has(JSXAttribute[name.name='target'][value.value='_blank']):has(JSXAttribute[name.name='href'] > JSXExpressionContainer > Literal[value=/^\\//])",
    message: 'Pages of this site open in the same tab: drop target=_blank from internal links.',
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message:
      'No raw HTML from JSX: render text, sanitise markdown through @/utils/markdown, and emit structured data with <JsonLd> (the one allowed use).',
  },
];

// Every rule above except the NAV_LIST one (a later config replaces the whole rule).
const restrictedSyntaxWithoutNavList = restrictedSyntax.filter(
  (rule) => !rule.selector.startsWith("MemberExpression[object.name='NAV_LIST']"),
);

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/**']),
  {
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // typescript-eslint 8 split the old ban-types rule (off here) into these three; keep them off the same way.
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      // eslint-plugin-react-hooks 7 (eslint-config-next 16) adds React Compiler rules to its recommended set. The
      // site does not use the compiler; they were not checked before the upgrade and report 63 existing patterns,
      // so they warn until those components are rewritten (the single responsive tree and the section controller).
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': ['error', ...restrictedSyntax],
    },
  },
  {
    // Positional NAV_LIST[<number>] lookups that predate the ban (2026-11-15). They point at the right
    // sections today; convert each to NAV.<id> and remove the file from this list.
    files: [
      'src/app/connect/Connect.tsx',
      'src/app/portfolio/_components/Portfolio.tsx',
      'src/app/vision/_components/MobileVision.tsx',
      'src/atoms/nav.ts',
      'src/components/common/MobileFixedUI.tsx',
      'src/components/common/MobileScrollButton.tsx',
      'src/components/common/PCFixedUI.tsx',
      'src/components/common/ScrollButton.tsx',
      'src/components/common/VerticalCarousel.tsx',
      'src/components/gl/ConnectGL.tsx',
      'src/components/gl/MobileThreeWrapper.tsx',
      'src/components/gl/MobileVisionGL.tsx',
      'src/components/gl/VisionGL.tsx',
      'src/components/gl/model/vision/DragonModel.tsx',
      'src/hooks/anim/useHomeAnimations.tsx',
      'src/hooks/useMobileNavigation.tsx',
    ],
    rules: { 'no-restricted-syntax': ['error', ...restrictedSyntaxWithoutNavList] },
  },
  {
    // Command-line scripts report on stdout.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
  {
    // Structured data is the one place raw HTML is allowed: JsonLd escapes every '<'.
    files: ['src/components/seo/JsonLd.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
]);
