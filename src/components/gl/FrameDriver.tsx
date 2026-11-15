'use client';

import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect } from 'react';
import { isReducedMotion, onReducedMotionChange } from '@/motion/preference';

/** Longest step a frame may take, so a canvas that was paused or hidden resumes smoothly instead of jumping. */
const MAX_STEP_S = 0.1;
/** Frames rendered after anything that can change the still frame, so loaded textures and shaders settle in it. */
const STILL_FRAMES = 12;

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
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    let time = performance.now() / 1000;
    let last = performance.now();
    // Reduced motion (MOT-02): the canvas shows a still frame. It renders a few frames whenever something that shapes
    // that frame changes (the canvas comes into view, its size, the camera, which the section timelines move, the
    // visible objects, their opacity and the textures, as models load and fade in), until that settles, then stops:
    // zero draw calls at rest.
    let reduced = isReducedMotion();
    let signature = '';
    let pending = STILL_FRAMES;
    const stillSignature = (shown: boolean) => {
      let objects = 0;
      let opacity = 0;
      scene.traverse((node) => {
        objects += node.visible ? 1 : 0;
        const material = (node as { material?: { opacity?: number } }).material;
        if (material && typeof material.opacity === 'number') opacity += material.opacity;
      });
      const m = camera.matrixWorld.elements;
      return `${shown}|${canvas.width}x${canvas.height}|${objects}|${opacity.toFixed(2)}|${gl.info.memory.textures}|${gl.info.memory.geometries}|${m[12].toFixed(3)},${m[13].toFixed(3)},${m[14].toFixed(3)},${m[0].toFixed(4)},${m[5].toFixed(4)},${m[10].toFixed(4)}`;
    };
    const offPreference = onReducedMotionChange((next) => {
      reduced = next;
      pending = STILL_FRAMES;
    });
    const tick = () => {
      const now = performance.now();
      const step = Math.min((now - last) / 1000, MAX_STEP_S);
      last = now;
      const shown = isShown(canvas);
      if (reduced) {
        const next = stillSignature(shown);
        if (next !== signature) {
          signature = next;
          pending = STILL_FRAMES;
        }
        if (!shown || pending <= 0) return;
        pending -= 1;
        // Time runs while the frame settles (a model fading in finishes its fade), and stops with it.
        time += step;
        advance(time, true);
        return;
      }
      if (!shown) return;
      time += step;
      advance(time, true);
    };
    gsap.ticker.add(tick);
    return () => {
      offPreference();
      gsap.ticker.remove(tick);
    };
  }, [advance, canvas, scene, camera, gl]);

  return null;
}
