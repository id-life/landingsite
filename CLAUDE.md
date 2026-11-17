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
                  # npm run build clears .next/cache/webpack first and checks next/font classes after (scripts/next-font-guard.mjs,
                  # docs/design-tokens.md "Fonts and the build"); a Vercel build command must stay `npm run build`.
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

- home, portfolio, insights, spectrum, presence, digitaltwin, connect (the seven experience sections), news, podcast

- `/` and the six section URLs render the same client-only experience (`src/app/(home)/_components/HomeEntry.tsx`);
  the URL selects the section. Section layouts carry metadata, JSON-LD and the server-rendered summary.
- `src/app/(experience)/spectrum` is the Spectrum section; `src/app/(content)/spectrum/disease-management` and
  `influence-network` are standalone tool pages with their own layout (no experience nav).
- There is no `/about` (the owner removed it, 2026-11-18): it answers 404 like any unknown address.
  `src/app/content-review/page.preview.tsx` is the owner's draft review page: a route only in
  non-production builds (`pageExtensions` in `next.config.mjs`), noindex, linked from nowhere.
- `/news`, `/news/[id]` and two fixed articles; `/podcast` and `/podcast/long-talk` (the two shows, static with ISR;
  `/podcast?c=lt` answers 308 from `src/proxy.ts`, as do any other `?c=` (to `/podcast`) and leading-zero ids such
  as `/podcast/056`) and `/podcast/[id]`. Unknown ids return 404. The retired `/vision`, `/value` and `/mission` answer
  308 to `/presence`, `/connect` and `/` (`redirects()` in `next.config.mjs`).
- Route handlers: `robots.ts`, `sitemap.ts` (ISR hourly; only canonical URLs, dates from content), `llms.txt/route.ts`,
  `api/revalidate` (the CMS publish webhook: regenerates pages and pings IndexNow and Baidu; 404 without
  `REVALIDATE_SECRET`). The IndexNow key file is `public/<key>.txt` (`src/lib/indexnow.ts`). Error UI: `not-found.tsx`, `error.tsx`,
  `global-error.tsx`, all using `src/components/common/ErrorState.tsx`.
- `src/app/twin` and `src/app/vision` hold section components, not routes. Unreachable modules are deleted rather
  than kept: `npm run knip` fails on an unused file or dependency.

## Architecture of the experience

- **Device profile and the two trees (RWD-02, in progress).** `src/styles/device-classes.ts` is the one definition of the
  width classes (compact < 600, medium 600-839, expanded 840-1199, large >= 1200), compact height (< 480), pointer and
  the tree query: the phone experience for `(max-width: 768px), (max-height: 479.98px)` (so phones in landscape and a
  laptop at 200 % zoom get it too), the desktop experience otherwise. Tailwind `mobile:` / `notMobile:` and the
  `compact: medium: expanded: large: shortScreen: coarse: navRow:` screens are built from it; JavaScript reads
  `useDeviceProfile()` (one matchMedia store, tree debounced 200 ms, mirrored as `<html data-tree data-width-class
data-pointer>`); `useIsMobile()` is a wrapper. Never write `max-width: 768px` again (`test/device-classes.test.mjs`).
  `HomeEntry` still renders `MobileHome` or `Home`, separate trees with `Mobile*` sections; they are being merged
  section by section, so a change usually still needs both.
  Merged so far (one component taking `deck`): Connect, Vision, Portfolio's type, Presence (`Engagement`, `WorldMap` and
  its dots; portrait windows get a sideways-panning map) and Digital Twin (`Twin` plus its controls; `avatar` is
  'canvas' on the desktop deck, 'media' on the phone deck, `src/app/twin/twin-deck.ts`). The twin canvas stage
  (`TwinThreeWrapper`) is mounted once by the shell outside ScrollSmoother's `#content` (Home today).
- **Site header and footer (NAV-04).** One `SiteHeader` (`src/components/site`) on every route: hook-free, so content
  pages render it on the server; client islands are `SubscribeTrigger` (an `idl:subscribe` DOM event,
  `subscribe-events.ts`; `SubscribePopup` / `useSubscribeBridge` connect it to the popup), `MenuToggle` (+ `SiteMenu`
  on first open) and `LinkTracker` (delegated clicks on `data-nav-id` / `data-channel`). The experience renders it as
  the fixed overlay through `ExperienceHeader` (section controller, ids `#nav` / `#mobile-nav` assigned once mounted;
  the suite reads their opacity as "ready"). Exactly one item has aria-current. Keep jotai, tailwind-merge and
  prefetching links out of the content pages' header and footer (PERF-10: <= 180 kB first-party JS).
- **Loader gate.** `src/components/gl/ProgressLoader.tsx` gates on the hero assets only and sets `globalLoadedAtom`
  (`src/atoms/geo.ts`); later-section 3D mounts on approach. A 15 s fail-open reveals the UI if loading stalls.
  `HeroPreloads` (in each section layout) preloads the hero model and wordmark textures.
- **Fixed UI** (nav, arrows, player) is revealed from `fadeInAnimCompletedAtom`, not by imperative tweens; the intro
  tween in `DragonModel` only runs on a first visit.
- **Desktop scrolling.** GSAP ScrollSmoother (created in `src/hooks/anim/useHomeAnimations.tsx`) with one scrubbed
  ScrollTrigger timeline per section. Each ends its entrance on a `'rest'` label, where every arrival lands
  (`src/utils/section-step.ts`); add one to any new section timeline.
- **Section controller** (MOT-01, `src/motion/sectionController.ts`): the one way to change section, on both trees:
  `goToSection(indexOrId, source)` and `stepSection(dir, source)`. State is `sectionStateAtom` (`index`, `target`,
  `phase`, `direction`; mirrored as `<html data-section-phase data-section-target>`); `isSectionMoving()`,
  `isLayoutRefreshing()` and `afterSectionSettles()` replace the old window flags. Each tree registers a driver: the
  desktop deck in `src/hooks/anim/useDesktopSections.ts` (wheel, keys, tablet touch; one gesture = one step, re-armed
  after 200 ms of wheel silence; neighbours tween the smoother's `scrollTop` for `DURATION.section`, far jumps fade a
  cover; an opposite step reverses, anything else retargets; the nav is never dimmed), the phone in
  `usePhoneSectionDriver` (`src/hooks/useMobileNavigation.tsx`). When a transition ends the controller writes the URL
  and title (push for explicit navigation, replace for scrolling, nothing for deep links) and calls
  `noteSectionView` exactly once; Back and Forward record one view. `useNavigation` and `useMobileNavigation` are thin
  wrappers. Never tween the window or change `smoother.smooth()` from a section.
- **Phone.** No document scroll: sections switch through the controller from the arrows (`SectionPager.tsx`,
  which also owns the inner pages), the menu and `useMobileSwipe` (a swipe counts only if nothing scrolled).
- **URL and history.** `HashRouter` (loaded by `ExperienceRouter` in the root layout on the first experience URL, then
  never unmounted) applies the URL once per mount of the experience
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
- **Fail safe (ENG-02).** `HeroPreloads` runs an inline WebGL probe while the HTML is parsed (`window.__idlWebGL`,
  `__idlGpu`) and preloads the hero model only when WebGL works. `useExperienceMode` (`full` | `static` | `poster`):
  without WebGL no canvas, loader or model mounts (`StaticReveal`); a lost hero context or a failed hero scene shows the
  poster. `HeroPoster` (server-rendered by `HomeEntry`) is the DOM wordmark: first paint, the no-WebGL hero, the
  stand-in during context loss. Each model sits in its own `ModelBoundary`; the UI is revealed from `OuterLoader`, never
  from a model. Canvases use `onCanvasCreated(name)` from `GLBoundary.tsx`.
- **Rendering (MOT-03).** Every `<Canvas>` has `frameloop="never"` and a `FrameDriver`: it renders from the GSAP ticker
  and only while the canvas can be seen (hide a canvas with opacity 0 or visibility hidden and it stops drawing in the
  same frame). `src/motion/runtime.ts` pauses everything (ticker, p5, held animation frames) after 60 s without input
  and in a hidden tab; `onMotionPause` / `useMotionPaused` for any new loop. p5 sketches loop only while active and on
  screen (`P5Canvas`).
- **Reduced motion (MOT-02, `src/motion/preference.ts`)**: the only reader of `prefers-reduced-motion` (plus the CSS
  guard in `globals.css`); the OS setting is its only input. There is no on-page motion control: the owner rejected
  the Motion switch (it clutters the header), so do not add one back. Read `isReducedMotion()` /
  `useReducedMotionPref()` when starting a movement and `onReducedMotionChange` for loops; every `DURATION` token reads 0
  while reduced, `<html>` gets `.motion-reduced`, motion components follow `MotionPreferenceConfig`.
  Reduced mode is designed: section changes are 0.2 s crossfades (at least 400 ms apart), canvases render a settled
  still frame and stop (`FrameDriver`), particle logos draw at their targets once (`P5Canvas` never loops), and the
  ripples, carousel, marquee, map pulses, map auto-cards, Twin attention loops and visualiser stay still. Any new loop
  must stop when reduced. Scrubbed entrances are `fromTo` with explicit end values, not `from`.
- **Quality tiers (MOT-06).** `src/motion/gpuTier.ts` (low / mid / high) sets DPR cap, composer MSAA, glass samples and
  fluid grid; `AdaptiveDpr` steps DPR down on sustained drops; canvases expose `data-tier` / `data-dpr`. The hero glass
  is one preset (`HERO_GLASS` in `config/visionGLConfig.ts`, owner's choice pending; `?hero-glass=0-5` outside
  production). `docs/device-tiers.md`.
- **Assets (PERF-05, PERF-14).** Particle logos read precomputed points (`scripts/precompute-particles.mjs` ->
  `public/particles/*.bin` + `particle-points.json`; re-run it after changing a particle image or parameter, the unit
  test fails otherwise) and start only once the visitor leaves the hero. Models come from
  `scripts/optimize-models.mjs` with hashed names in `src/components/gl/models-manifest.json`; never hand-edit a file
  under `public/models` (`docs/models.md`). The desktop wordmark is rasterised from the SVGs at screen resolution
  (`useLogoTextures`).
- **Motion tokens** (MOT-08, `src/motion/tokens.ts`): every duration, ease, stagger and distance. GSAP gets the eases
  under their token names and `gsap.defaults` from `src/motion/gsap.ts` (imported by `gsap-plugins.ts`); CSS gets
  `--dur-*` / `--ease-*` (Tailwind `duration-<token>`, `ease-token-<name>`); motion gets `MOTION.*` (`presets.ts`).
  Inside a scrubbed timeline lengths are `beats(n)`. Lint rejects a numeric `duration:`, a string `ease:` and timing
  among a `gsap.timeline()`'s own vars outside `src/motion`. `docs/motion-inventory.md` has the mapping.
- **GSAP stays in the experience.** Plugins are registered in `src/utils/gsap-plugins.ts`, imported by the experience's
  entry points (HomeEntry, ClientNav, HashRouter), not by the root providers. Shared dialogs pause the smoother through
  `src/utils/smoother.ts`; never import `gsap/*` plugins from code that content pages load.

## Design tokens and type (VIS-02, VIS-07)

- `src/styles/tokens.ts` is the one source of colours, font roles, type roles and the grid; `tokens.css` is generated
  from it (`node scripts/build-tokens.mjs`, checked by `test/tokens.test.mjs`). `theme.colors` in tailwind.config.ts
  REPLACES Tailwind's palette: a palette utility (`text-red-600`) renders nothing, and no six-digit hex may appear in
  src outside the token files (unit test and suite). After merging new colours run `node scripts/codemod-color-tokens.mjs`.
- Components name a font role (`font-display`, `font-text`, `font-title`, `font-button`, `font-menu`,
  `font-brand`), never a face; `FONT_PALETTE` in tokens.ts is the owner's open font choice. Chinese display strings
  are the closed list in `src/constants/display-strings.ts`, set from a generated Source Han subset
  (`UPDATE_CJK_SUBSET=1 npx vitest run test/cjk-display.test.mjs`); all other Chinese uses the system faces.
- The root is a fixed 100 % (16 px) on every route (RWD-01). `--u`, the layout unit, is 0.8333vw on the desktop
  experience (what the root used to be) and 1rem elsewhere; `scripts/postcss-layout-unit.js` turns every rem in the
  compiled CSS into `--u` (layout) or `--t` (font-size and line-height, no floor), so rem in a class draws exactly as in
  the original. `--t` is `--u` except in the experience's tablet tiers (desktop deck below 1200 px), where it is a fixed
  12 px (the original's 1440 size). The owner's rule (2026-11-16): from 1200 px and on phones every text has the
  original's size; do not enlarge text with roles, floors or minimums there. GSAP and inline styles use `u(n)` from
  `src/utils/layout-unit.ts`. The nine type roles are custom properties, so they stay real rem. Touch targets: the
  `tap` / `tap-area` utilities (RWD-06, 44 px on coarse pointers). Guide: `docs/design-tokens.md`; device tiers:
  `docs/support-matrix.md`.

## Content pages

- `/news` and `/podcast` layouts are server components. Client code there is limited to islands: the headers, the
  footer form, the cards, the player and the transcript's delegated timeline click. The SUBSCRIBE popup
  (`SubscribePopup`), the phone menus, the video modal and the comments load on first use (`next/dynamic`).
- Not in the content pages' first-load JavaScript (PERF-10; `npm run perf:budget` measures it): the Sentry SDK (lazy,
  above), React Query (`ReactQueryProvider` is mounted by the experience, the Influence Network tool and the podcast
  comments, around themselves, sharing one client; not by the root providers), react-hook-form, the consent and
  Google tag boot and Vercel's scripts (`src/lib/analytics/lazy.tsx`). Keep it that way.
- Episode transcripts are rendered to HTML on the server (`podcast/[id]/page.tsx`); do not move react-markdown back
  into a client component. SVG icons are imported per file (there is no `src/components/svg` barrel: it pulled the
  3,085-circle world map into every page that used one icon).

## Content, data and SEO

- **Content layer** (`src/content/`): fund facts, people, themes, companies, press, grants, books, papers, labs, the
  profile behind llms.txt, slogans, Connect, Digital Twin and subscribe copy, each route's metadata topic and
  description (`pages.ts`, passed to `buildMetadata` in `src/lib/seo/metadata.ts`), and the two long articles
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
- `reactStrictMode` is on (ENG-16): in development every effect mounts, unmounts and mounts again, so effects must be
  idempotent. Create the ScrollSmoother before any ScrollTrigger (`ScrollSmootherRoot` in `Home.tsx`): a pinned
  trigger created before it keeps its spacer through a revert, and the remount nests a second one.
- **Analytics** (`src/lib/analytics`) run only in analytics builds (`ANALYTICS_ENABLED`: production by default,
  `NEXT_PUBLIC_ANALYTICS_ENABLED=1` to force). One Google tag, gtag, owned in code: `HeadScript` (first in <head>:
  Consent Mode v2 defaults, landing URL, load stage) and `AnalyticsBoot` (consent, then gtag/js after
  experience_ready or the first input, at least 2 s in). Never add GTM, `@next/third-parties/google` or a second
  loader (lint rules). Send events only with `track()`; names and parameters are typed by the catalog in
  `events.ts` (`EVENTS.md` and `events.json` beside it are generated from it; `UPDATE_ANALYTICS_DOCS=1 npm test` refreshes it).
  Section views: the landing page_view is sent explicitly and a section change made before gtag/js ran is counted
  on its load event (`stream.ts`); every later change is GA4's own page_view on history events, so set
  `document.title` before changing the URL and never send a manual page_view for it. Config holds nothing
  page-specific (config values stick to every hit). GA4 queues hits after the first and sends them in batches
  (about 5 s, or at once when the page is hidden): a test reading the wire must hide the page first. Consent (`consent.ts`): opt-in in the EEA, UK, CH, CN and unknown regions, opt-out
  elsewhere, GPC and automated browsers (navigator.webdriver, headless UA) are refusals; `/api/geo` gives the
  country (`idl_region` cookie overrides it outside production). Banner text is a draft in `consent-copy.ts` and is
  not rendered by production builds until approved. The banner itself is `src/components/consent/ConsentBanner.tsx`: Tailwind scans
  `src/{app,components,hooks,constants,pages}` only, so a component with classes must not live in `src/lib`. Vercel Analytics and Speed Insights render only with
  `NEXT_PUBLIC_VERCEL_INSIGHTS=1` (paid beyond quota); otherwise the one Core Web Vitals stream is `vitals.ts`
  (web_vital with attribution, filed under the landing URL and section; `perf/vitals-p75.sql` reads it from the GA4
  BigQuery export, `scripts/crux-weekly.mjs` adds CrUX). Sentry only on Vercel production and preview: errors plus
  light tracing, no Replay or profiling (`src/lib/sentry-options.ts`, tunnel `/monitoring`); report caught errors
  with `reportError` (`src/lib/report.ts`). The browser SDK is not in the first-load bundle (PERF-10):
  `src/lib/sentry-client.ts` queues captures and uncaught errors and loads `src/lib/sentry-init.ts` when the page is
  idle or on the first error; client code never imports `@sentry/nextjs` directly (use `reportError` or
  `captureException` from `sentry-client`).
- Newsletter: every form posts to `POST /api/subscribe` (`src/app/api/subscribe`: validation, honeypot, rate limit,
  optional Turnstile, Mailchimp upstream with double opt-in) through `submitNewsletter` (`src/utils/newsletter.ts`);
  the browser never contacts Mailchimp. Typed result codes in `src/lib/newsletter/result.ts`, 6 s browser timeout.
  The popup opens only on request.
- Security headers (CSP, HSTS, COOP, CORP) come from `security-headers.mjs`; a new third-party host must be added
  there (CSP is enforced outside production, report-only in production until `CSP_MODE=enforce`).
- Incidents, rollback and uptime checks: `RUNBOOK.md`.
- Images: `NEXT_PUBLIC_IMAGE_OPTIMIZER` (next.config.mjs) decides who resizes next/image images: `off` on Vercel by
  default (Vercel Image Optimization is metered and not approved), `next` on self-hosted builds, `cdn` for the CMS
  cover loader in `src/lib/image-loader.ts`. Never turn the Vercel optimizer on in code; it is the owner's switch.

## Analytics build (for the e2e suite)

`DEPLOY_ENV=preview NEXT_PUBLIC_ANALYTICS_ENABLED=1 NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=<QA stream id> npm run build` (the id is never committed: without it no tag loads),
then `npm start`. Use the production stream only when every beacon is answered locally (the suite's safety fixture
does); never browse such a build outside the harness. Set `idl_region=DE` (opt-in) or `idl_region=SG` (opt-out) as a
cookie to pick the consent path, and mask `navigator.webdriver` and the headless user agent, or the site treats the
browser as automation and loads no analytics. The QA stream's enhanced measurement must match production (page views
on history changes on, Scrolls off).

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
