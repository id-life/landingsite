# Performance budget

Two things live here: the **target budget** the site is working towards (from the roadmap item PERF-09, written down
verbatim below), and the **recorded numbers** that CI enforces today so nothing gets heavier while the work towards
the target ships.

## Target budget (PERF-09, verbatim)

Experience phone {beforeInteraction 1.2 MiB, first20s 2 MB, requests 80, jsBeforeLcp 170 kB gz, js20s 620 kB, LCP 2.5 s,
INP 200 ms, TBT 300 ms, CLS 0.05}; experience laptop/tablet {1.5 MiB, session 6 MiB, LCP 2.0 s, INP 150 ms, TBT 200 ms};
content {400 KB, 30 requests, JS 180 kB gz (130 kB once Sentry is deferred) + 60 kB third-party, LCP 1.8 s, INP 100 ms,
TBT 100 ms, CLS 0.02}.

Field values are the 75th percentile of real visits; lab values use the Lighthouse mobile and desktop presets.

| Route class | Device         | Number                            | Target                                       | Moved by (roadmap items)                    | Owner       |
| ----------- | -------------- | --------------------------------- | -------------------------------------------- | ------------------------------------------- | ----------- |
| Experience  | Phone          | Bytes before first interaction    | 1.2 MiB                                      | PERF-01, PERF-03, PERF-05, PERF-06, PERF-14 | to be named |
| Experience  | Phone          | Bytes in the first 20 s           | 2 MB                                         | PERF-01, PERF-05, PERF-14                   | to be named |
| Experience  | Phone          | Requests                          | 80                                           | PERF-05, PERF-06, PERF-14                   | to be named |
| Experience  | Phone          | JS before LCP                     | 170 kB gzip                                  | PERF-03, PERF-06                            | to be named |
| Experience  | Phone          | JS in the first 20 s              | 620 kB                                       | PERF-06                                     | to be named |
| Experience  | Phone          | LCP / INP / TBT / CLS             | 2.5 s / 200 ms / 300 ms / 0.05               | PERF-03, PERF-08                            | to be named |
| Experience  | Laptop, tablet | Bytes before first interaction    | 1.5 MiB                                      | PERF-01, PERF-05, PERF-06, PERF-14          | to be named |
| Experience  | Laptop, tablet | Bytes per session                 | 6 MiB                                        | PERF-14                                     | to be named |
| Experience  | Laptop, tablet | LCP / INP / TBT                   | 2.0 s / 150 ms / 200 ms                      | PERF-03, PERF-08                            | to be named |
| Content     | All            | Bytes                             | 400 KB                                       | PERF-01, PERF-10                            | to be named |
| Content     | All            | Requests                          | 30                                           | PERF-10                                     | to be named |
| Content     | All            | First-party JS                    | 180 kB gzip (130 kB once Sentry is deferred) | PERF-10, PERF-11                            | to be named |
| Content     | All            | Third-party JS before interaction | 60 kB                                        | DATA items (analytics)                      | to be named |
| Content     | All            | LCP / INP / TBT / CLS             | 1.8 s / 100 ms / 100 ms / 0.02               | PERF-10, PERF-08                            | to be named |

## What CI enforces today

`npm run perf:budget` (scripts/perf-budget.mjs) runs in the `build and performance budget` job of
`.github/workflows/ci.yml` after `npm run build`. It starts `next start` itself and checks two measurements against
`perf-budget.json`; a pull request fails when a number grows past its recorded value plus the tolerance in that file.

- **Initial JS per route** (no browser): every `/_next/static` script the server-rendered HTML of the route
  references, gzipped (level 9) from `.next/static`. `nomodule` polyfills are skipped. This counts the root layout,
  section layouts and page chunks, which Next's own "First Load JS" left out (and Next 16 no longer prints).
- **First visit per device** (headless Chrome over the DevTools protocol, cold cache): phone 390x844 @3x, tablet
  820x1180 @2x, laptop 1440x900, on `/`, `/news` and `/podcast/56`. The visit ends when the experience's nav is
  visible and the network has been quiet for 3 s (60 s cap). Bytes are the transferred size (`encodedDataLength`)
  of every request. CMS content (cdn.id.life media, YouTube thumbnails and id-platform API responses, also when they
  come through `/_next/image`) is reported as `contentKB` but not budgeted, because an editor publishing a post
  changes it without a code change. The check fails if the experience gets no WebGL context: CI runners have no GPU,
  so Chrome runs WebGL on SwiftShader (`PERF_GPU=swiftshader`, the default on Linux).

The target budget is printed as a warning, never a failure: asserting it today would fail every pull request. When
an item ships and moves a number, re-record (`npm run perf:budget -- --record`), commit the new `perf-budget.json` in
the same pull request and say why. Lighthouse CI on the Vercel preview (the LCP, INP, TBT and CLS rows) needs the
preview protection bypass secret and is not wired yet.
