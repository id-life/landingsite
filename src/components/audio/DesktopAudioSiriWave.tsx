'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import type SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

function DesktopAudioSiriWave({ className }: { className?: string; amplitude?: number; speed?: number }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);
  // The wave is created after its library loads (lazily, PERF-10), so the play-state effect re-runs once it exists.
  const [wave, setWave] = useState<SiriWave | null>(null);
  const onInit = useCallback((created: SiriWave) => {
    siriwaveRef.current = created;
    setWave(created);
  }, []);

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
    <div className={cn('relative h-[26px] w-[44px] overflow-hidden mobile:h-[20px]', className)}>
      <div className="absolute top-1/2 -z-10 h-[0.5px] w-full -translate-y-1/2 bg-white" />
      <div className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2">
        <Siriwave width={120} amplitude={playStatus ? 0.5 : 0} height={60} theme="ios9" onInit={onInit} />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
