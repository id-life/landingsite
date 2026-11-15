# CLAUDE.md

Guidance for coding agents working on www.id.life (Immortal Dragons 不朽真龙), a Next.js 16 App Router site (React 19,
React Three Fiber 9, drei 10) with a scroll-driven 3D experience and server-rendered content pages. Read
this before changing anything; update it in the same commit as any change to the architecture it describes.

## Commands

```bash
npm ci            # install exactly what package-lock.json pins
npm run dev       # dev server on http://localhost:3000 (Turbopack; writes to .next/dev, so it can run beside a build)
npm run build     # production build with webpack (next build --webpack; also type-checks). Not `npx next build`:
                  # Next 16 defaults to Turbopack, which reaches the first screen about 270 ms later here on fast 4G
npm run build:turbopack   # the same build on Turbopack, to re-measure before switching
npm start         # serve the production build
npm run lint      # ESLint CLI with the flat config in eslint.config.mjs (next lint no longer exists in Next 16)
npm run lint:ratchet   # fails if any rule has more warnings than eslint-warnings.json (re-record with --record)
npm test          # vitest unit tests (markdown sanitising, error handling, routes, content parity)
npm run knip      # unused files and dependencies (fails); unused exports (warnings). Config: knip.jsonc
npm run perf:budget   # after a build: initial JS per route + first visit per device vs perf-budget.json
npm run typecheck                         # full type check (next typegen, then tsc --noEmit; works on a fresh checkout)
npx prettier --write --ignore-unknown .   # format
npx --yes cspell@10.4.0 --no-progress "src/**/*.{ts,tsx,md}"   # spell-check (cspell.json; docs/content-style.md)
```

The pre-commit hook (simple-git-hooks + lint-staged) runs `eslint --fix` and prettier on staged files only.

CI (`.github/workflows/ci.yml`, on every pull request and on pushes to main) runs typecheck, lint + warning ratchet +
knip, unit tests, `npm audit --omit=dev --audit-level=high`, and a production build followed by `npm run perf:budget`.
Each job is its own status check. Run the same commands locally before pushing.

## Routes

**Pages:**

- home, portfolio, insights, spectrum, presence, digitaltwin, connect (the seven experience sections), news, podcast, about

- `/` and the six section URLs render the same client-only experience (`src/app/(home)/_components/HomeEntry.tsx`);
  the URL selects the section. Section layouts carry metadata, JSON-LD and the server-rendered summary.
- `src/app/(experience)/spectrum` is the Spectrum section; `src/app/(content)/spectrum/disease-management` and
  `influence-network` are standalone tool pages with their own layout (no experience nav).
- `/about` (CON-01): the fund profile as visible server-rendered text from the content layer, in the content pages'
  header and footer. `src/app/content-review/page.preview.tsx` is the owner's draft review page: a route only in
  non-production builds (`pageExtensions` in `next.config.mjs`), noindex, linked from nowhere.
- `/news`, `/news/[id]` and two fixed articles; `/podcast` (`?c=` channel) and `/podcast/[id]`. Unknown ids return 404.
- Route handlers: `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`. Error UI: `not-found.tsx`, `error.tsx`,
  `global-error.tsx`, all using `src/components/common/ErrorState.tsx`.
- `src/app/twin` and `src/app/vision` hold section components, not routes. Unreachable modules are deleted rather
  than kept: `npm run knip` fails on an unused file or dependency.

## Architecture of the experience

- **Two trees.** `HomeEntry` renders `MobileHome` at <= 768 px (`src/hooks/useIsMobile.tsx`) and `Home` above. They are
  separate component trees with separate sections (`Mobile*` components); a change usually needs both.
- **Loader gate.** `src/components/gl/ProgressLoader.tsx` gates on the hero assets only and sets `globalLoadedAtom`
  (`src/atoms/geo.ts`); later-section 3D mounts on approach. A 15 s fail-open reveals the UI if loading stalls.
  `HeroPreloads` (in each section layout) preloads the hero model and wordmark textures.
- **Fixed UI** (nav, arrows, player) is revealed from `fadeInAnimCompletedAtom`, not by imperative tweens; the intro
  tween in `DragonModel` only runs on a first visit.
- **Desktop scrolling.** GSAP ScrollSmoother (created in `src/hooks/anim/useHomeAnimations.tsx`) with one
  ScrollTrigger timeline per section. Section stepping: `useScrollSmootherAction` (wheel; one gesture = one step,
  200 ms of wheel silence between steps), `useSectionInput` (keyboard and tablet touch), both dispatching through
  `src/utils/section-step.ts`. Window flags `isNavScrolling`, `isSmootherScrolling`, `isResizing` are declared in
  `global.d.ts`; respect them instead of adding new ones.
- **Phone.** No document scroll: sections switch through `useMobileNavigation`, the arrows
  (`MobilePageArrows.tsx`), the menu and `useMobileSwipe` (a swipe counts only if nothing scrolled).
- **URL and history.** `HashRouter` (root layout, never unmounts) applies the URL once per mount of the experience
  (`useExperienceLifecycle` bumps `experienceMountIdAtom`); `useSectionUrlSync` replaces the URL and title as the
  visitor scrolls; nav clicks push. Scroll restoration is 'manual' only while the experience is mounted.
- **Spectrum and Presence hash routes** are data in `src/hooks/spectrum/spectrum-routes.ts` (unit-tested in
  `test/spectrum-routes.test.mjs`); deep links replace the history entry.
- **Section ids**: use `NAV.<id>` from `src/components/nav/nav.ts`, never `NAV_LIST[<number>]` (lint rule).
- **Bundling.** SVGs import as React components with `?component` (SVGR) and shaders (`.glsl/.vert/.frag`) import as
  strings, in both `webpack()` (production) and `turbopack.rules` (dev) in `next.config.mjs`. Production builds use
  webpack: Turbopack 16.4 merges three, swiper and the GL code into one 1.8 MB lazy chunk on the path to the first
  canvas. Request APIs are async (`await props.params`, `await props.searchParams`).
- **Hero gate.** `HeroAssetsGate` (`src/components/gl/heroAssets.ts`) mounts the hero only once its resources are in
  R3F's loader cache, so it never suspends: React 19 holds back the reveal of a Suspense boundary that resolves within
  300 ms of its fallback, which delayed every first screen. Add any new hero resource to its cache keys.

## Content, data and SEO

- **Content layer** (`src/content/`): fund facts, people, themes, companies, press, grants, books, papers, labs, the
  profile behind llms.txt, slogans, Connect, Digital Twin and subscribe copy, and the two long articles
  (`src/content/articles/*.md`). Records are data only (`{ en, zh }` text, URLs, image paths, dates), typed with
  `import type` from the zod schemas in `schema.ts` (so zod never ships to the browser) and validated by
  `src/content/validate.ts`, which the root layout imports: `next build` fails on an invalid record. Presentation
  (logo sizes, particle images, icons, Tailwind classes) stays in the component, keyed by the record's slug. Never type
  a fund fact (contact@id.life, US$40 million, 15+, the Biopolis address) outside `src/content`; `entity.ts`,
  llms.txt and the About page derive from it (`test/content-layer.test.mjs` fails otherwise). The feed fields the
  site needs from id-platform are specified in `docs/id-platform-content-api.md`.
- **Approval** (CON-10, `docs/content-approval.md`): every record carries `approval` (`legacy` = live at the 6a90671
  baseline, `approved` = approvedBy + approvedAt). Agent-written copy is a `draft` in `src/content/drafts/`, which only
  the review page may import (ESLint) and which throws in a production build. A legacy fact with `pendingRuling` keeps
  rendering where it was but no new placement shows it (`isConfirmed`). Never ship new wording without the owner's
  approval; write a draft instead. `docs/content-inventory.md` lists every copy deliverable and its status.
- API layer: `src/apis/request.ts` (axios, `ApiError`, `isApiNotFound`) and `src/apis/index.ts`. The base URL is
  `NEXT_PUBLIC_API_PREFIX`; public defaults for every `NEXT_PUBLIC_*` value live in `next.config.mjs`
  (see `.env.example`). Never commit `.env`.
- Markdown from the CMS goes through `src/utils/markdown.ts` (sanitised; no raw HTML from JSX). Structured data
  goes through `src/components/seo/JsonLd.tsx`; links from API data through `src/utils/safe-href.ts`.
- Server-rendered summaries for crawlers and assistive tech: `PageSEOContent`. Never hide text from people while
  serving it to crawlers (no `aria-hidden` text, no zero-height wrappers).
- p5 sketches mount through `src/components/gl/particle/P5Canvas.tsx` (one instance per sketch, props through
  `updateWithProps`). Do not bring back `@p5-wrapper/react`: version 4 bundles React 18's JSX runtime and breaks on
  React 19, version 5 needs p5 2.
- No `console.log` in src (ESLint `no-console`; `console.warn` and `console.error` are allowed for real problems).
  The drei `StatsGl` overlay loads only in development (`NEXT_PUBLIC_ENABLE_PREF=1 npm run dev`).
- `reactStrictMode` is off on purpose: under Strict Mode (development only) the five pinned sections get nested pin
  spacers and the particle sketch mounts a second p5 canvas. Make those effects idempotent before turning it on.
- Analytics run only in production builds (`ANALYTICS_ENABLED`, `src/constants/env.ts`); Sentry only on Vercel
  production and preview, with no Replay or profiling in the shared runtime.
- Newsletter: `src/utils/subscribe.ts` (Mailchimp JSONP, typed result codes). The popup opens only on request.

## Testing safely

- **Never submit the newsletter or Influence Network forms** against any build, local ones included: they write
  to the real Mailchimp list and the production API. Mock them (Playwright `route.fulfill`).
- Run browser checks against a local production build (`npm run build && npm start`) or a Vercel preview. Do not
  point automated browsers at www.id.life: Vercel's firewall challenges them, and it skews analytics.
- The end-to-end suite (Playwright, laptop / phone / tablet / WebKit, guards and targets) lives outside this repo
  in `idlife-audit/tests` of the maintainers' scripts repository; run it with `AUDIT_SITE=<build URL>` and
  `SITE_REPO=<this checkout>`.

## Definition of done

1. `npm run typecheck`, `npm run lint` (errors fail; the React Compiler rules of eslint-plugin-react-hooks 7 warn),
   `npm test` and `npm run knip` pass.
2. `npm run build` succeeds.
3. The e2e suite shows no guard regression against the baseline, and the targets of the item you worked on are green.
4. Checked on a preview or local build on phone, tablet and laptop; screenshots or a recording for visible changes.
5. This file is updated if the architecture changed.
