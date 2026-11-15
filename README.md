# www.id.life

The website of Immortal Dragons 不朽真龙, a purpose-driven longevity fund: a scroll-driven 3D experience (seven
sections) plus server-rendered news, podcast and Spectrum tool pages.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, three.js with React Three Fiber, GSAP 3.15
(ScrollTrigger, ScrollSmoother, SplitText), p5, jotai, TanStack Query, Sentry, deployed on Vercel.

## Getting started

```bash
npm ci
npm run dev        # http://localhost:3000
```

No environment variables are required: public defaults for every `NEXT_PUBLIC_*` value are in `next.config.mjs`.
Override them per environment (Vercel project settings, or a local `.env` copied from `.env.example`).

| Script                        | What it does                |
| ----------------------------- | --------------------------- |
| `npm run dev`                 | development server          |
| `npm run build` / `npm start` | production build and server |
| `npm run lint`                | ESLint (next lint)          |
| `npm test`                    | vitest unit tests           |

## Architecture

See [CLAUDE.md](CLAUDE.md) for the route list, the two component trees (phone at <= 768 px, desktop above), the
loader gate, section stepping, URL and history handling, the API layer and the SEO rules.

## Testing

- Unit tests: `npm test`.
- End to end: a Playwright suite (laptop, phone, tablet and WebKit profiles; guards that protect working behaviour
  and targets that encode known defects) runs against a local production build or a Vercel preview. Never submit
  the newsletter or Influence Network forms from a test: they write to production services.

## Deploy

Vercel builds a preview for every pushed branch and deploys `main` to production. Analytics run only in production
builds; Sentry reports only from production and preview.

## Licence

All rights reserved; see [LICENSE](LICENSE). Third-party fonts and models: [docs/licences.md](docs/licences.md).
