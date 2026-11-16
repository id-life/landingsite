# Device tiers for the 3D experience (MOT-06)

**Rule (owner, 2026-11-16): every device starts at the original site's quality.** His verdict on the glass was "just
keep the original glass effect", with no device named, so no device may start below what the original renders on it.
A reduction is allowed only if it is invisible in a side-by-side at device pixel ratio 2 and 3 with the difference
amplified, or if it is adaptive: applied only after the device has failed to hold its frame rate for a sustained
period, never in the first seconds.

## What every device renders

Source: `src/motion/gpuTier.ts` (`TIER_BUDGETS`, the same original values on every tier).

| Setting                   | Value (as the original)                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| Hero pixel ratio          | the device's own, up to 2 (then adaptive, below)                        |
| Hero canvas               | antialias on, depth on, high-performance context                        |
| Hero composer MSAA        | 8                                                                       |
| Glass transmission        | 10 samples; buffer 128 px on the desktop deck, 256 px on the phone deck |
| Pointer fluid             | 128 grid                                                                |
| Digital Twin canvas       | pixel ratio 1 to 2, antialias on                                        |
| Particle canvases (p5.js) | p5.js default: the full device pixel ratio                              |

The tier (`low` / `mid` / `high`, from the inline capability probe in `src/components/gl/HeroPreloads.tsx`) is still
detected: it is a parameter of GA4's `experience_ready` (`gpu_tier`, or none without WebGL), and every WebGL error
report to Sentry carries `gpu_tier` and `webgl_caveat` (failIfMajorPerformanceCaveat, recorded only) as tags.

## Adaptive pixel ratio

drei's `PerformanceMonitor` (`src/components/gl/AdaptiveDpr.tsx`) is mounted 10 s after the canvas (loading, shader
compilation and the intro run before it) and judges 5 s windows: when 75 % of a window's samples are below the frame
rate floor it steps the pixel ratio down by 0.25 (never below 1), and back up on recovery, never above the start; it
stops after three direction changes. The canvas wrapper exposes `data-tier` and `data-dpr`.

## Invisible savings kept

- **The fluid solver idles** 180 frames after the last pointer movement: the dye has faded by 0.96 per frame to
  under 0.1 % (below one 8-bit step), and the post pass reads only the dye.
- **Hidden canvases draw nothing** (FrameDriver), and a reduced-motion visitor gets a still frame.
