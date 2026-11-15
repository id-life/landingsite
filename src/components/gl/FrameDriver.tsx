'use client';

import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect } from 'react';

/** Longest step a frame may take, so a canvas that was paused or hidden resumes smoothly instead of jumping. */
const MAX_STEP_S = 0.1;

/** Whether the canvas can be seen: in the viewport, and no ancestor hidden or at (near) zero opacity. */
function isShown(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2 || rect.bottom <= 0 || rect.top >= innerHeight) return false;
  if (rect.right <= 0 || rect.left >= innerWidth) return false;
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.02) return false;
  }
  return true;
}

/**
 * Renders its canvas from the GSAP ticker, and only while the canvas can be seen (MOT-03). Every <Canvas> uses
 * frameloop="never" and mounts one of these:
 * - one animation-frame loop for the whole experience: GSAP's ticker already runs every frame for the tweens,
 *   ScrollTrigger and ScrollSmoother; rendering from it (after the tweens of the same frame) replaces React Three
 *   Fiber's own requestAnimationFrame loop instead of adding a second one;
 * - a hidden canvas (opacity 0, visibility hidden, off screen) is not rendered at all: zero draw calls. Visibility is
 *   read every frame, so a canvas starts drawing in the very frame a tween reveals it;
 * - when the experience pauses (60 s idle, hidden tab: src/motion/runtime.ts) the ticker sleeps and so does every
 *   canvas.
 * A visible canvas renders every frame, as frameloop "always" did: the hero's idle swing, the glass distortion and
 * the jellyfish move continuously ("demand" rendering would need the designer to accept a still idle frame).
 */
export default function FrameDriver() {
  const advance = useThree((state) => state.advance);
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    let time = performance.now() / 1000;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const step = Math.min((now - last) / 1000, MAX_STEP_S);
      last = now;
      if (!isShown(canvas)) return;
      time += step;
      advance(time, true);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance, canvas]);

  return null;
}
