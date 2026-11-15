import dynamic from 'next/dynamic';
import { useAtomValue } from 'jotai';
import { useSyncExternalStore } from 'react';
import { currentPageIndexAtom, mobileCurrentPageIndexAtom } from '@/atoms/nav';

/**
 * PERF-05: the particle sketches (and p5 with them) start on approach, not with the hero. The Portfolio and Spectrum
 * logos sit one and three sections below Mission, so they are wanted once the visitor is past the hero, lands deeper,
 * or shows an intent to move on (the first wheel, key, touch or pointer press): the Mission-to-Portfolio transition
 * then covers p5's download. A visitor who stays on the hero downloads no p5 and no particle data.
 */
let intent = false;
const intentListeners = new Set<() => void>();
const INTENT_EVENTS = ['wheel', 'keydown', 'touchstart', 'pointerdown'] as const;
function onIntent() {
  intent = true;
  INTENT_EVENTS.forEach((type) => window.removeEventListener(type, onIntent, true));
  intentListeners.forEach((listener) => listener());
}
function subscribeIntent(listener: () => void) {
  if (!intent && intentListeners.size === 0) {
    INTENT_EVENTS.forEach((type) => window.addEventListener(type, onIntent, { capture: true, passive: true }));
  }
  intentListeners.add(listener);
  return () => void intentListeners.delete(listener);
}

function useParticlesWanted() {
  const desktop = useAtomValue(currentPageIndexAtom);
  const mobile = useAtomValue(mobileCurrentPageIndexAtom);
  const moved = useSyncExternalStore(
    subscribeIntent,
    () => intent,
    () => false,
  );
  return moved || desktop > 0 || mobile > 0 || (typeof window !== 'undefined' && window.location.pathname !== '/');
}

// 使用动态导入确保 ReactP5Wrapper 只在客户端加载
const DynamicReactP5Wrapper = dynamic(() => import('./DynamicParticleGL').then((mod) => mod.default), {
  ssr: false,
});
const StaticReactP5Wrapper = dynamic(() => import('./StaticParticleGL').then((mod) => mod.default), {
  ssr: false,
});

const ParticleGL = ({
  activeAnim,
  imageIdx,
  id,
  getSourceImgInfos,
  isStatic,
}: {
  activeAnim?: boolean;
  imageIdx: number;
  id?: string;
  isStatic?: boolean;
  getSourceImgInfos: (isMobile: boolean) => {
    scaleNum?: number;
    resize?: number[];
    url: string;
    loadPercentage?: number;
    resolution?: number;
    forceColor?: [number, number, number];
    instantColor?: boolean;
  }[];
}) => {
  const wanted = useParticlesWanted();
  if (!wanted) return null;
  return isStatic ? (
    <StaticReactP5Wrapper activeAnim={activeAnim} imageIdx={imageIdx} id={id} getSourceImgInfos={getSourceImgInfos} />
  ) : (
    <DynamicReactP5Wrapper activeAnim={activeAnim} imageIdx={imageIdx} id={id} getSourceImgInfos={getSourceImgInfos} />
  );
};

export default ParticleGL;
