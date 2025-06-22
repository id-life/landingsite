'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';

function DesktopAudioSiriWave({ className }: { className?: string }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? 3 : 0);
  }, [playStatus]);

  return (
    <div
      ref={containerRef}
      className={cn('relative h-[26px] flex-1 overflow-hidden mobile:my-[2px] mobile:h-[22px]', className)}
    >
      <div className="absolute top-1/2 -z-10 h-[0.5px] w-full -translate-y-1/2 bg-background" />
      <div className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2">
        <Siriwave width={120} height={60} amplitude={0} theme="ios9" onInit={(siriwave) => (siriwaveRef.current = siriwave)} />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
