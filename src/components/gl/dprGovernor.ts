/**
 * The decision behind the 3D canvas's adaptive pixel ratio (MOT-06), kept free of React so it can be tested with
 * synthetic frame times. Fed the time of every frame the canvas renders, it answers whether to step the pixel ratio
 * down, up, or not at all:
 * - down when at least SHARE of the frames of the last WINDOW_MS were slower than 30 fps, judged on a full window of
 *   frames rendered since the last change, so a short hitch (a texture upload, a shader compiling) never counts;
 * - up when at least SHARE of the frames of a longer window ran at 50 fps or better. The gap between 30 and 50 fps is
 *   the hysteresis: a canvas between the two is left alone;
 * - each time a step down follows a step up (the higher ratio did not hold), the next step up needs twice as long a
 *   window, so a device on the edge settles instead of switching back and forth.
 * A pause between frames longer than GAP_MS (a hidden canvas, a sleeping tab, the experience paused) is not a slow
 * frame: the window restarts after it. On a device that holds its frame rate nothing ever changes.
 */

/** Frames judged per verdict: the last 2 s. */
export const WINDOW_MS = 2000;
/** The first step-up window; it doubles after every step up that had to be taken back. */
export const INCLINE_WINDOW_MS = 3000;
/** Share of a window's frames that must agree. */
export const SHARE = 0.75;
/** A frame slower than this is slow (under 30 fps). */
export const SLOW_FRAME_MS = 1000 / 30;
/** A frame at least this fast leaves headroom (50 fps or better). */
export const FAST_FRAME_MS = 1000 / 50;
/** A longer interval is a pause, not a frame. */
export const GAP_MS = 250;

export type DprStep = 'down' | 'up' | null;

export function createDprGovernor() {
  let samples: { t: number; dt: number }[] = [];
  let windowStart = 0;
  let last = 0;
  let inclineWindow = INCLINE_WINDOW_MS;
  let lastStep: DprStep = null;

  const restart = (now: number) => {
    samples = [];
    windowStart = now;
  };

  const share = (from: number, test: (dt: number) => boolean) => {
    let n = 0;
    let hits = 0;
    for (const s of samples) {
      if (s.t < from) continue;
      n += 1;
      if (test(s.dt)) hits += 1;
    }
    return n ? hits / n : 0;
  };

  return {
    /** A frame was rendered at `now` (ms). `canDown` / `canUp`: whether the ratio has room to move that way. */
    frame(now: number, canDown: boolean, canUp: boolean): DprStep {
      const dt = last ? now - last : 0;
      last = now;
      if (!dt || dt > GAP_MS) {
        restart(now);
        return null;
      }
      samples.push({ t: now, dt });
      const keep = Math.max(WINDOW_MS, inclineWindow);
      while (samples.length && samples[0].t < now - keep) samples.shift();
      const covered = now - windowStart;
      let step: DprStep = null;
      if (canDown && covered >= WINDOW_MS && share(now - WINDOW_MS, (d) => d > SLOW_FRAME_MS) >= SHARE) step = 'down';
      else if (canUp && covered >= inclineWindow && share(now - inclineWindow, (d) => d <= FAST_FRAME_MS) >= SHARE) step = 'up';
      if (step) {
        if (step === 'down' && lastStep === 'up') inclineWindow *= 2;
        lastStep = step;
        // Judge the new ratio on its own frames only.
        restart(now);
      }
      return step;
    },
    /** Forget the frames so far (judging starts or resumes). */
    reset() {
      last = 0;
      samples = [];
    },
  };
}
