import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { registerSmootherLookup } from '@/utils/smoother';
// The motion tokens' eases and GSAP defaults (MOT-08), before any experience tween is created.
import '@/motion/gsap';

/**
 * GSAP plugin registration for the 3D experience, imported for its side effect by the experience's entry
 * points (HomeEntry, ClientNav, HashRouter). It used to run in the root providers, which put GSAP and six
 * plugins into the first load of every page, /news and /podcast included. Registering twice is harmless.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, ScrollToPlugin, DrawSVGPlugin, SplitText, MotionPathPlugin);
registerSmootherLookup(() => ScrollSmoother.get());
