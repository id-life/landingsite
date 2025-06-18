import { currentPlayStatusAtom } from '@/atoms/audio-player';
import Siriwave from '@/components/common/Siriwave';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import React, { useEffect, useRef } from 'react';
import SiriWave from 'siriwave';

function DesktopAudioSiriWave({ className }: { className?: string }) {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);

  useEffect(() => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? 3 : 0);
  }, [playStatus]);

  return (
    <div className={cn('flex-center relative h-6 flex-1 overflow-hidden', className)}>
      <div className="translate-y-[10%]">
        <Siriwave width={100} height={30} amplitude={0} theme="ios9" onInit={(siriwave) => (siriwaveRef.current = siriwave)} />
      </div>
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
