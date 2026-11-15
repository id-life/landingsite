import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSmootherLookup } from '@/utils/smoother';
// The motion tokens' eases and GSAP defaults (MOT-08), before any experience tween is created.
import '@/motion/gsap';

/**
 * GSAP plugin registration for the 3D experience, imported for its side effect by the experience's entry
 * points (HomeEntry, ClientNav, HashRouter). It used to run in the root providers, which put GSAP and six
 * plugins into the first load of every page, /news and /podcast included. Registering twice is harmless.
 */
/**
 * ScrollTrigger, without its keep-alive loop (MOT-03). When it is enabled, ScrollTrigger requests an animation frame
 * every frame for as long as the page lives (_rafBugFix: "in some browsers (like Firefox), screen repaints weren't
 * consistent unless we had SOMETHING queued up"). The GSAP ticker already runs every frame whenever anything moves,
 * so at rest that loop only doubled the page's frame callbacks (124 a second on Mission). It is the only frame
 * ScrollTrigger queues while it registers, so that one frame is cancelled and the loop never starts. The 60 s idle
 * pause (src/motion/runtime.ts) still holds frames as before.
 */
function registerScrollTrigger() {
  if (typeof window === 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    return;
  }
  const request = window.requestAnimationFrame;
  const queued: number[] = [];
  window.requestAnimationFrame = (callback) => {
    const id = request.call(window, callback);
    queued.push(id);
    return id;
  };
  try {
    gsap.registerPlugin(ScrollTrigger);
  } finally {
    window.requestAnimationFrame = request;
  }
  queued.forEach((id) => window.cancelAnimationFrame(id));
}

registerScrollTrigger();
// DrawSVG and SplitText were registered too but nothing uses them (MOT-14).
gsap.registerPlugin(useGSAP, ScrollSmoother, ScrollToPlugin, MotionPathPlugin);
registerSmootherLookup(() => ScrollSmoother.get());
