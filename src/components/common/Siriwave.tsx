import React, { useEffect, useRef } from 'react';
import type * as SiriWave from 'siriwave';
import { onMotionPause } from '@/motion/runtime';
import { isReducedMotion, onReducedMotionChange } from '@/motion/preference';

declare type CurveStyle = 'ios' | 'ios9';

export declare type IReactSiriwaveProps = {
  theme?: CurveStyle;
  ratio?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  color?: string;
  cover?: boolean;
  width?: number;
  height?: number;
  autostart?: boolean;
  pixelDepth?: number;
  lerpSpeed?: number;
  curveDefinition?: SiriWave.ICurveDefinition[];
  onInit?: (siriwave: SiriWave.default) => void;
};

const ReactSiriwave = (props: IReactSiriwaveProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // The library loads with the first wave, not with the page (PERF-10: about 3 kB gzip of the episode page's first
  // load). A wave whose component is gone, or re-rendered, before the import resolves is never created.
  useEffect(() => {
    let siriwave: SiriWave.default | null = null;
    let disposed = false;
    void import('siriwave').then(({ default: Wave }) => {
      if (disposed || !wrapperRef.current) return;
      siriwave = new Wave({
        container: wrapperRef.current!,
        style: props.theme ?? 'ios',
        width: props.width ?? 640,
        height: props.height ?? 200,
        speed: props.speed ?? 0.2,
        amplitude: props.amplitude ?? 1,
        frequency: props.frequency ?? 6,
        color: props.color ?? '#fff',
        cover: props.cover ?? false,
        autostart: props.autostart ?? true,
        pixelDepth: props.pixelDepth ?? 0.02,
        lerpSpeed: props.lerpSpeed ?? 0.01,
        curveDefinition: props.curveDefinition,
        ratio: 2,
      });
      // Reduced motion (MOT-02): the visualiser holds still; start() does nothing until motion is back.
      // A disposed wave ignores start(): a caller can still hold this instance after a prop change replaced it (the
      // new one is created a moment later, when the import resolves), and the library's start() throws on a disposed
      // instance. That exception, raised in an effect when the music player's play button was pressed, took the
      // whole page to the error screen.
      const wave = siriwave;
      const start = wave.start.bind(wave);
      wave.start = () => {
        if (!disposed && !isReducedMotion()) start();
      };
      if (isReducedMotion()) wave.stop();
      if (typeof props.onInit === 'function') props.onInit(siriwave);
    });
    const offReduced = onReducedMotionChange((reduced) => {
      if (reduced && siriwave?.run) siriwave.stop();
    });

    // MOT-03: the visualiser stops with the rest of the experience (60 s idle, hidden tab) and resumes as it was.
    let wasRunning = false;
    const offPause = onMotionPause((paused) => {
      if (!siriwave) return;
      if (paused) {
        wasRunning = siriwave.run;
        if (wasRunning) siriwave.stop();
      } else if (wasRunning) siriwave.start();
    });

    return () => {
      disposed = true;
      offPause();
      offReduced();
      siriwave?.dispose();
    };
  }, [
    props,
    props.amplitude,
    props.autostart,
    props.color,
    props.cover,
    props.curveDefinition,
    props.frequency,
    props.height,
    props.lerpSpeed,
    props.pixelDepth,
    props.speed,
    props.theme,
    props.width,
  ]);
  return <div ref={wrapperRef}></div>;
};

export default React.memo(ReactSiriwave);
