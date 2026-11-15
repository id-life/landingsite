# CLAUDE.md

Guidance for coding agents working on www.id.life (Immortal Dragons 不朽真龙), a Next.js 14 App Router site with a
scroll-driven 3D experience and server-rendered content pages. Read this before changing anything; update it in the
same commit as any change to the architecture it describes.

## Commands

```bash
npm ci            # install exactly what package-lock.json pins
npm run dev       # dev server on http://localhost:3000
npm run build     # production build (also type-checks app routes)
npm start         # serve the production build
npm run lint      # next lint (ESLint, including the repo's no-restricted-syntax rules)
npm test          # vitest unit tests (markdown sanitising, error handling, routes, content parity)
npx tsc --noEmit -p .                     # full type check
npx prettier --write --ignore-unknown .   # format
```

The pre-commit hook (simple-git-hooks + lint-staged) runs lint and prettier on staged files.

## Routes

**Pages:**

- home, portfolio, insights, spectrum, presence, digitaltwin, connect (the seven experience sections), news, podcast

- `/` and the six section URLs render the same client-only experience (`src/app/(home)/_components/HomeEntry.tsx`);
  the URL selects the section. Section layouts carry metadata, JSON-LD and the server-rendered summary.
- `src/app/(experience)/spectrum` is the Spectrum section; `src/app/(content)/spectrum/disease-management` and
  `influence-network` are standalone tool pages with their own layout (no experience nav).
- `/news`, `/news/[id]` and two fixed articles; `/podcast` (`?c=` channel) and `/podcast/[id]`. Unknown ids return 404.
- Route handlers: `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`. Error UI: `not-found.tsx`, `error.tsx`,
  `global-error.tsx`, all using `src/components/common/ErrorState.tsx`.
- Not routable (no page.tsx; dead code to delete): `src/app/partners`, `processes`, `tracking`. `src/app/twin` and
  `src/app/vision` hold section components, not routes.

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

## Content, data and SEO

- API layer: `src/apis/request.ts` (axios, `ApiError`, `isApiNotFound`) and `src/apis/index.ts`. The base URL is
  `NEXT_PUBLIC_API_PREFIX`; public defaults for every `NEXT_PUBLIC_*` value live in `next.config.mjs`
  (see `.env.example`). Never commit `.env`.
- Markdown from the CMS goes through `src/utils/markdown.ts` (sanitised; no raw HTML from JSX). Structured data
  goes through `src/components/seo/JsonLd.tsx`; links from API data through `src/utils/safe-href.ts`.
- Server-rendered summaries for crawlers and assistive tech: `PageSEOContent`. Never hide text from people while
  serving it to crawlers (no `aria-hidden` text, no zero-height wrappers).
- **Analytics** (`src/lib/analytics`) run only in analytics builds (`ANALYTICS_ENABLED`: production by default,
  `NEXT_PUBLIC_ANALYTICS_ENABLED=1` to force). One Google tag, gtag, owned in code: `HeadScript` (first in <head>:
  Consent Mode v2 defaults, landing URL, load stage) and `AnalyticsBoot` (consent, then gtag/js after
  experience_ready or the first input, at least 2 s in). Never add GTM, `@next/third-parties/google` or a second
  loader (lint rules). Send events only with `track()`; names and parameters are typed by the catalog in
  `events.ts` (`EVENTS.md` and `events.json` beside it are generated from it; `UPDATE_ANALYTICS_DOCS=1 npm test` refreshes it).
  Section views are GA4's own page_view on pushState/replaceState: set `document.title` before changing the URL and
  never send a manual page_view. Consent (`consent.ts`): opt-in in the EEA, UK, CH, CN and unknown regions, opt-out
  elsewhere, GPC and automated browsers (navigator.webdriver, headless UA) are refusals; `/api/geo` gives the
  country (`idl_region` cookie overrides it outside production). Banner text is a draft in `consent-copy.ts` and is
  not rendered by production builds until approved. Vercel Analytics and Speed Insights render only with
  `NEXT_PUBLIC_VERCEL_INSIGHTS=1` (paid beyond quota). Sentry only on Vercel production and preview, errors only
  (`src/lib/sentry-options.ts`, tunnel `/monitoring`); report caught errors with `reportError` (`src/lib/report.ts`).
- Newsletter: every form posts to `POST /api/subscribe` (`src/app/api/subscribe`: validation, honeypot, rate limit,
  optional Turnstile, Mailchimp upstream with double opt-in) through `submitNewsletter` (`src/utils/newsletter.ts`);
  the browser never contacts Mailchimp. Typed result codes in `src/lib/newsletter/result.ts`, 6 s browser timeout.
  The popup opens only on request.
- Security headers (CSP, HSTS, COOP, CORP) come from `security-headers.mjs`; a new third-party host must be added
  there (CSP is enforced outside production, report-only in production until `CSP_MODE=enforce`).
- Incidents, rollback and uptime checks: `RUNBOOK.md`.

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

1. `npx tsc --noEmit -p .`, `npm run lint` and `npm test` pass.
2. `npm run build` succeeds.
3. The e2e suite shows no guard regression against the baseline, and the targets of the item you worked on are green.
4. Checked on a preview or local build on phone, tablet and laptop; screenshots or a recording for visible changes.
5. This file is updated if the architecture changed.
