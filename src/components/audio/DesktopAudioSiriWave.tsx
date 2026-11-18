'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import type SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useIsMobile } from '@/hooks/useIsMobile';

function DesktopAudioSiriWave({ className }: { className?: string; amplitude?: number; speed?: number }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);
  // The wave is created after its library loads (lazily, PERF-10), so the play-state effect re-runs once it exists.
  const [wave, setWave] = useState<SiriWave | null>(null);
  const onInit = useCallback((created: SiriWave) => {
    siriwaveRef.current = created;
    setWave(created);
  }, []);

  // The wave's canvas is drawn at a size in pixels. On the phone deck it follows the deck's unit like every other box
  // (an upright tablet shows the phone version proportionally larger): its box is 7.5rem wide there (120 px at phone
  // widths, unchanged), and the canvas is drawn at whatever width that box measures. The laptop deck keeps 120 px and
  // the box it always had.
  const isPhoneDeck = useIsMobile() === true;
  const boxRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setWaveWidth] = useState(120);
  const waveWidth = isPhoneDeck ? measuredWidth : 120;
  useEffect(() => {
    const box = boxRef.current;
    if (!isPhoneDeck || !box || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const width = Math.round(box.getBoundingClientRect().width * 10) / 10;
      if (width > 0) setWaveWidth((current) => (Math.abs(current - width) > 0.5 ? width : current));
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [isPhoneDeck]);

  useEventBus(MessageType.SIRI_WAVE_CONFIG, ({ amplitude, speed }) => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? amplitude : 0);
    siriwaveRef.current.setSpeed(playStatus ? speed : 0);
  });

  useEffect(() => {
    if (!wave) return;
    if (playStatus) {
      wave.start();
      return;
    }
    wave.setAmplitude(0);
    wave.setSpeed(0);
    // MOT-03: once the wave has eased down to a flat line, stop its draw loop (it redrew the same flat line 60 times
    // a second for as long as nothing played). The last frame stays on the canvas; play starts it again.
    const settle = setInterval(() => {
      if (wave.amplitude < 0.002) {
        wave.stop();
        clearInterval(settle);
      }
    }, 500);
    return () => clearInterval(settle);
  }, [playStatus, wave]);

  return (
    <div className={cn('relative h-[26px] w-[44px] overflow-hidden mobile:h-[1.25rem]', className)}>
      <div className="absolute top-1/2 -z-10 h-[0.5px] w-full -translate-y-1/2 bg-white" />
      <div
        ref={boxRef}
        className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2 mobile:mt-[0.1875rem] mobile:w-[7.5rem]"
      >
        <Siriwave width={waveWidth} amplitude={playStatus ? 0.5 : 0} height={waveWidth / 2} theme="ios9" onInit={onInit} />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
