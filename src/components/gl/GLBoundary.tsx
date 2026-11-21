'use client';

import { PropsWithChildren, Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { type RootState, useThree } from '@react-three/fiber';
import { probeWebGL, reportExperienceError, watchWebGLContext } from '@/lib/analytics/experience';
import { reportError } from '@/lib/report';
import { gpuReportTags } from '@/motion/gpuTier';
import { markHeroSceneFailed, setContextLost } from '@/hooks/useExperienceMode';

/**
 * Error boundary of every WebGL canvas (DATA-06, ENG-02). A canvas that throws renders nothing: the hero poster
 * (HeroPoster, driven by the experience mode) stands in for the hero, and the rest of the page keeps working. The
 * error goes to Sentry (area=webgl, canvas) and to GA4 as experience_error webgl_render. It also runs the one-time
 * WebGL capability probe, which reports webgl_unavailable.
 */
export default function GLBoundary({ canvas, children }: PropsWithChildren<{ canvas: string }>) {
  useEffect(() => void probeWebGL(), []);
  return (
    <ErrorBoundary
      fallback={null}
      onError={(error) => {
        reportExperienceError('webgl_render', canvas, error);
        if (canvas === 'vision') markHeroSceneFailed();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * One boundary per model (ENG-02): a model whose file fails to load or parse removes only its own object. Every other
 * model, the canvas and the page stay. Reported once per model to Sentry (area=webgl); the failed file itself is
 * reported to GA4 as asset_failed by the loader's progress listener.
 */
export function ModelBoundary({
  canvas,
  model,
  onError,
  suspense = true,
  children,
}: PropsWithChildren<{ canvas: string; model: string; onError?: () => void; suspense?: boolean }>) {
  return (
    <ErrorBoundary
      fallback={null}
      onError={(error) => {
        reportError(error, { area: 'webgl', kind: 'model_failed', canvas, model, ...gpuReportTags() });
        onError?.();
      }}
    >
      {/* suspense=false leaves loading to the parent's Suspense (the twin's Views settle as one). */}
      {suspense ? <Suspense fallback={null}>{children}</Suspense> : children}
    </ErrorBoundary>
  );
}

/**
 * <Canvas onCreated>: context loss and restore (ENG-02). A lost context throws nothing; without these listeners the
 * hero just emptied. preventDefault (in watchWebGLContext) lets the browser restore it; while it is lost the hero
 * poster covers the canvas, and on restore three.js re-uploads the scene and the canvas draws again.
 */
export function onCanvasCreated(canvas: string) {
  const watch = watchWebGLContext(canvas);
  return (state: RootState) => {
    const el = state.gl.domElement;
    // First of the canvas's listeners: the loss React Three Fiber causes when it releases a canvas unmounted on
    // purpose (<ReleaseOnUnmount>) is a release, not a failure, so no poster and no report follow it.
    el.addEventListener(
      'webglcontextlost',
      (event) => {
        if (released.has(el)) event.stopImmediatePropagation();
      },
      { capture: true },
    );
    watch(state);
    el.addEventListener('webglcontextlost', () => setContextLost(canvas, true));
    el.addEventListener('webglcontextrestored', () => {
      setContextLost(canvas, false);
      state.invalidate();
    });
  };
}

const released = new WeakSet<HTMLCanvasElement>();

/**
 * Rendered inside a <Canvas> that is unmounted on purpose (MOT-09: the Twin's canvas away from the Twin). Its cleanup
 * runs before React Three Fiber's teardown, which disposes the renderer and forces the context's loss to give it back
 * at once; the canvas is marked so that loss is not taken for a failure.
 */
export function ReleaseOnUnmount() {
  const gl = useThree((state) => state.gl);
  useEffect(() => () => void released.add(gl.domElement), [gl]);
  return null;
}
