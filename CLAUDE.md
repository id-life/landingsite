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
- `/news`, `/news/[id]` and two fixed articles; `/podcast` and `/podcast/long-talk` (the two shows, static with ISR;
  `/podcast?c=lt` answers 308 from `src/proxy.ts`) and `/podcast/[id]`. Unknown ids return 404.
- Route handlers: `robots.ts`, `sitemap.ts` (ISR hourly; only canonical URLs, dates from content), `llms.txt/route.ts`,
  `api/revalidate` (the CMS publish webhook: regenerates pages and pings IndexNow and Baidu; 404 without
  `REVALIDATE_SECRET`). The IndexNow key file is `public/<key>.txt` (`src/lib/indexnow.ts`). Error UI: `not-found.tsx`, `error.tsx`,
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
- **Phone.** No document scroll: sections switch through the controller from the arrows (`MobilePageArrows.tsx`,
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
- **Motion tokens** (MOT-08, `src/motion/tokens.ts`): every duration, ease, stagger and distance. GSAP gets the eases
  under their token names and `gsap.defaults` from `src/motion/gsap.ts` (imported by `gsap-plugins.ts`); CSS gets
  `--dur-*` / `--ease-*` (Tailwind `duration-<token>`, `ease-token-<name>`); motion gets `MOTION.*` (`presets.ts`).
  Inside a scrubbed timeline lengths are `beats(n)`. Lint rejects a numeric `duration:`, a string `ease:` and timing
  among a `gsap.timeline()`'s own vars outside `src/motion`. `docs/motion-inventory.md` has the mapping.
- **GSAP stays in the experience.** Plugins are registered in `src/utils/gsap-plugins.ts`, imported by the experience's
  entry points (HomeEntry, ClientNav, HashRouter), not by the root providers. Shared dialogs pause the smoother through
  `src/utils/smoother.ts`; never import `gsap/*` plugins from code that content pages load.

## Content pages

- `/news` and `/podcast` layouts are server components. Client code there is limited to islands: the headers, the
  footer form, the cards, the player and the transcript's delegated timeline click. The SUBSCRIBE popup
  (`SubscribePopup`), the phone menus, the video modal and the comments load on first use (`next/dynamic`).
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
- `reactStrictMode` is off on purpose: under Strict Mode (development only) the five pinned sections get nested pin
  spacers and the particle sketch mounts a second p5 canvas. Make those effects idempotent before turning it on.
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
  with `reportError` (`src/lib/report.ts`).
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
