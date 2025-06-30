'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils';
import SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';

function DesktopAudioSiriWave({ className, amplitude, speed }: { className?: string; amplitude?: number; speed?: number }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);

  useEffect(() => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? (amplitude ?? 0) : 0);
    siriwaveRef.current.setSpeed(playStatus ? (speed ?? 0) : 0);
  }, [amplitude, playStatus, speed]);

  return (
    <div className={cn('relative h-[26px] w-[84px] overflow-hidden mobile:my-[2px] mobile:h-[22px]', className)}>
      <div className="absolute top-1/2 -z-10 h-[0.5px] w-full -translate-y-1/2 bg-white" />
      <div className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2">
        <Siriwave
          width={120}
          amplitude={playStatus ? 1 : 0}
          height={60}
          theme="ios9"
          onInit={(siriwave) => (siriwaveRef.current = siriwave)}
        />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
