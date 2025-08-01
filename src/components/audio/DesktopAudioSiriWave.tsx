'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/utils';
import SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

function DesktopAudioSiriWave({ className }: { className?: string; amplitude?: number; speed?: number }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);

  useEventBus(MessageType.SIRI_WAVE_CONFIG, ({ amplitude, speed }) => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? amplitude : 0);
    siriwaveRef.current.setSpeed(playStatus ? speed : 0);
  });

  useEffect(() => {
    if (!siriwaveRef.current) return;
    if (!playStatus) {
      siriwaveRef.current.setAmplitude(0);
      siriwaveRef.current.setSpeed(0);
    }
  }, [playStatus]);

  return (
    <div className={cn('relative h-[26px] w-[44px] overflow-hidden mobile:h-[20px]', className)}>
      <div className="absolute top-1/2 -z-10 h-[0.5px] w-full -translate-y-1/2 bg-white" />
      <div className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2">
        <Siriwave
          width={120}
          amplitude={0.5}
          height={60}
          theme="ios9"
          onInit={(siriwave) => (siriwaveRef.current = siriwave)}
        />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
