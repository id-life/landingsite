# Device tiers for the 3D experience (MOT-06)

One probe per page decides a GPU quality tier; each tier has a fixed budget. Source: `src/motion/gpuTier.ts`
(`TIER_BUDGETS`). The probe is the inline capability script in `src/components/gl/HeroPreloads.tsx` (WebGL2, float
render targets, renderer string), plus Save-Data, `navigator.deviceMemory`, `hardwareConcurrency` and the pointer type.
No network request (drei's `useDetectGPU` downloads benchmark tables from a CDN, which the CSP does not allow).

| Tier | Who                                                                                                 | DPR cap | Composer MSAA | Glass samples | Fluid grid |
| ---- | --------------------------------------------------------------------------------------------------- | ------- | ------------- | ------------- | ---------- |
| low  | software renderer (SwiftShader, llvmpipe), no float render target, Save-Data, <= 2 GB or <= 2 cores | 1       | 0             | 4             | off        |
| mid  | everything else: phones, tablets                                                                    | 1.5     | 0             | 6             | 64         |
| high | fine pointer (laptop, desktop) with WebGL2                                                          | 2       | 8             | 10            | 128        |

Every tier: the hero canvases have no canvas antialias, stencil or depth buffer (the composer antialiases and has its
own depth); the glass dragon's transmission buffer is 128 px on the desktop deck and 256 px on the phone deck, as in the original design; the Digital Twin canvas (no composer)
keeps its depth buffer and gets antialiasing on the high tier only. Screen size is not an input, so an iPad mini and
an iPad Air with the same capabilities get the same tier.

**Adaptive DPR.** drei's `PerformanceMonitor` (`src/components/gl/AdaptiveDpr.tsx`) steps the DPR down by 0.25 (never
below 1) when about 75 % of 2.5 s of samples are under 40 fps (60 Hz screens), and back up on recovery; it stops after
three direction changes. The canvas wrapper exposes `data-tier` and `data-dpr`.

**Reporting.** The tier is a parameter of GA4's `experience_ready` (once per document) (`gpu_tier`: low / mid / high, or none without WebGL), and every WebGL error report to Sentry carries `gpu_tier` and
`webgl_caveat` (failIfMajorPerformanceCaveat, recorded only) as tags.

## Measured (local production build, 2026-11-15, Chrome with Metal ANGLE, hero at rest)

| Profile             | Tier | Hero DPR | Canvas backing store, all canvases                             | Before (UAT 4541)       |
| ------------------- | ---- | -------- | -------------------------------------------------------------- | ----------------------- |
| Phone 390x844 @3x   | mid  | 1.5      | 5.83 MP (hero 585x1266, six particle canvases 1200x703)        | 6.41 MP (hero 780x1688) |
| Tablet 820x1180 @2x | mid  | 1.5      | 12.06 MP (hero and twin 1230x1770 each, two particle canvases) | 15.45 MP                |
| Laptop 1440x900 @1x | high | 1        | 4.54 MP                                                        | 4.54 MP                 |
| QHD 2560x1440 @1x   | high | 1        | 9.32 MP                                                        |                         |

Draw calls per frame at rest (same build): phone hero 15 (UAT 475), laptop hero 7 (UAT 15), visible Digital Twin 23
(UAT 40, after PERF-14 removed the cornea transmission pass); hidden canvases 0.

Under 4x CPU throttling on the phone profile this machine still renders the hero at 60 fps, so the DPR correctly stays
at 1.5; at 60x the frame rate falls to 11-25 fps and the DPR steps to 1.25 within 4 s.
