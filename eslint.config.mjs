// ESLint flat config (ESLint 9). next lint is gone in Next 16, so this runs through the ESLint CLI: npm run lint.
// Migrated from .eslintrc.json with the same rules (https://nextjs.org/docs/app/api-reference/config/eslint).
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
    selector: 'Literal[value=/GTM-[A-Z0-9]+/]',
    message: 'No Google Tag Manager container: the one Google tag is gtag, owned by src/lib/analytics (DATA-08).',
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message:
      'No raw HTML from JSX: render text, sanitise markdown through @/utils/markdown, and emit structured data with <JsonLd> (the one allowed use).',
  },
  // Motion tokens (MOT-08): durations, eases and staggers come from src/motion/tokens.ts, so the feel is retuned in
  // one place. src/motion itself is exempt (below).
  {
    selector: "Property[key.name='duration'] > Literal[raw=/^\\.?\\d/]",
    message:
      "No numeric duration: use DURATION.<token> (or beats(n) inside a scrubbed timeline) from '@/motion/tokens' (MOT-08).",
  },
  {
    selector: "Property[key.name='ease'] > Literal[raw=/^['\"]/]",
    message: "No ease name: use EASE.<token> from '@/motion/tokens', the same curve CSS and motion play (MOT-08).",
  },
  {
    selector:
      "CallExpression[callee.property.name='timeline'] > ObjectExpression > Property[key.name=/^(duration|ease|stagger)$/]",
    message: "GSAP ignores duration, ease and stagger among a timeline's own vars: put them in { defaults: { ... } } (MOT-08).",
  },
];

// MOT-10: GSAP animates transform and opacity only. A layout property (width, height, left, top, right, bottom) in a
// tween makes the browser lay the page out again on every frame; x, y, scale and clip-path move the same pixels on
// the compositor.
const GSAP_LAYOUT_KEY = '/^(width|height|left|top|right|bottom)$/';
const GSAP_LAYOUT_MESSAGE =
  'No GSAP tween of a layout property (MOT-10): animate x, y, scale or clip-path instead of width, height, left, top, right or bottom.';
export const GSAP_LAYOUT_RULES = [
  {
    selector: `CallExpression[callee.property.name=/^(to|from|fromTo|set)$/] > ObjectExpression > Property[key.name=${GSAP_LAYOUT_KEY}]`,
    message: GSAP_LAYOUT_MESSAGE,
  },
  {
    selector: `CallExpression[callee.property.name=/^(to|from|fromTo|set)$/] > ObjectExpression > Property[key.value=${GSAP_LAYOUT_KEY}]`,
    message: GSAP_LAYOUT_MESSAGE,
  },
  {
    selector: `CallExpression[callee.property.name=/^(quickTo|quickSetter)$/] > Literal:nth-child(2)[value=${GSAP_LAYOUT_KEY}]`,
    message: GSAP_LAYOUT_MESSAGE,
  },
];
restrictedSyntax.push(...GSAP_LAYOUT_RULES);
const isGsapLayoutRule = (rule) => GSAP_LAYOUT_RULES.includes(rule);

// The layout tweens that predate the rule (2026-11-21), by file. Each is converted to transform or clip-path (MOT-10)
// and its file leaves this list; test/gsap-layout-keys.test.mjs fails while a listed file has none left.
export const GSAP_LAYOUT_TWEEN_FILES = [
  // The Digital Twin's stage and controls (image height, controls' left, top and bottom).
  'src/app/twin/Twin.tsx',
  'src/app/twin/_components/SwitchModel.tsx',
  'src/app/twin/_components/SwitchSkin.tsx',
  'src/app/twin/twin-deck.ts',
  'src/components/twin/Loader.tsx',
  // The Influence Network form's panels (bottom, top).
  'src/components/character-relation/BePartOfIt.tsx',
  'src/components/character-relation/CharacterRelation.tsx',
  // The scroll and START ripples (width, height).
  'src/components/common/ScrollButton.tsx',
  'src/components/common/StartButton.tsx',
  // The comparison slider (width).
  'src/components/compare/compare.tsx',
  // Connect's contact band (bottom).
  'src/hooks/connectGL/useConnectCrossAnimations.ts',
];

const isMotionRule = (rule) => /MOT-08/.test(rule.message);

// Positional NAV_LIST[<number>] lookups that predate the ban (2026-11-15). They point at the right sections today;
// convert each to NAV.<id> and remove the file from this list.
const NAV_LIST_FILES = [
  'src/app/connect/Connect.tsx',
  'src/app/portfolio/_components/Portfolio.tsx',
  'src/app/vision/_components/MobileVision.tsx',
  'src/atoms/nav.ts',
  'src/components/common/StartButton.tsx',
  'src/components/common/FixedUI.tsx',
  'src/components/common/ScrollButton.tsx',
  'src/components/common/VerticalCarousel.tsx',
  'src/components/gl/ConnectGL.tsx',
  'src/components/gl/MobileThreeWrapper.tsx',
  'src/components/gl/MobileVisionGL.tsx',
  'src/components/gl/VisionGL.tsx',
  'src/components/gl/model/vision/DragonModel.tsx',
  'src/hooks/anim/useHomeAnimations.tsx',
  'src/hooks/useMobileNavigation.tsx',
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
    // eslint-plugin-jsx-a11y's recommended rules (ENG-01), as warnings with their recommended options. They report
    // existing problems; scripts/eslint-ratchet.mjs (eslint-warnings.json) keeps the count from growing.
    rules: Object.fromEntries(
      Object.entries(jsxA11y.configs.recommended.rules).map(([rule, value]) => {
        const [severity, ...options] = Array.isArray(value) ? value : [value];
        return [rule, severity === 'off' || severity === 0 ? 'off' : ['warn', ...options]];
      }),
    ),
  },
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
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@next/third-parties/google',
              message:
                'Analytics go through src/lib/analytics (track() and AnalyticsBoot), never a second tag loader (DATA-08).',
            },
            {
              name: '@/hooks/useGA',
              message: "Removed: send events with track() from '@/lib/analytics/track' (DATA-11).",
            },
          ],
          patterns: [
            {
              group: ['@/content/drafts', '@/content/drafts/*', '**/content/drafts', '**/content/drafts/*'],
              message:
                'Drafts never ship (CON-10): only the preview review page may import them. Approve a draft by moving it into src/content with approvedBy and approvedAt (docs/content-approval.md).',
            },
          ],
        },
      ],
    },
  },
  {
    // The draft review page (preview builds only) and the drafts themselves may import drafts.
    files: ['src/app/content-review/**', 'src/content/drafts/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: NAV_LIST_FILES,
    rules: { 'no-restricted-syntax': ['error', ...restrictedSyntaxWithoutNavList] },
  },
  // A listed file keeps every other rule (and, where it is also on the NAV_LIST list, still skips that one).
  ...GSAP_LAYOUT_TWEEN_FILES.map((file) => ({
    files: [file],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...restrictedSyntax.filter(
          (rule) =>
            !isGsapLayoutRule(rule) && !(NAV_LIST_FILES.includes(file) && !restrictedSyntaxWithoutNavList.includes(rule)),
        ),
      ],
    },
  })),
  {
    // The motion token module defines the literals everyone else uses.
    files: ['src/motion/**'],
    rules: { 'no-restricted-syntax': ['error', ...restrictedSyntax.filter((rule) => !isMotionRule(rule))] },
  },
  {
    // Command-line scripts report on stdout.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
  {
    // Route handlers write one structured JSON line per request to the function log (console.info): consent
    // records, subscribe outcomes and load_abandon beacons (DATA-01, ENG-09, DATA-06). Debug output stays banned.
    files: ['src/app/api/**'],
    rules: { 'no-console': ['warn', { allow: ['warn', 'error', 'info'] }] },
  },
  {
    // Raw HTML is allowed in three places only: structured data (JsonLd escapes every '<'), the analytics head
    // script (DATA-08) and the WebGL probe that gates the hero model preload (ENG-02), both constants built from
    // code that must run during HTML parsing.
    files: ['src/components/seo/JsonLd.tsx', 'src/lib/analytics/HeadScript.tsx', 'src/components/gl/HeroPreloads.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
]);
