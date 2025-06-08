import React, { useEffect, useRef } from 'react';
import SiriWave from 'siriwave';
import { useAtomValue } from 'jotai';
import Siriwave from '@/components/common/Siriwave';
import { currentPlayStatusAtom } from '@/atoms/audio-player';

function DesktopAudioSiriWave() {
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const siriwaveRef = useRef<SiriWave | null>(null);

  useEffect(() => {
    if (!siriwaveRef.current) return;
    siriwaveRef.current.setAmplitude(playStatus ? 3 : 0);
  }, [playStatus]);

  return (
    <div className="flex-center h-6 flex-1 overflow-hidden pt-1.5">
      <Siriwave width={100} height={30} amplitude={0} theme="ios9" onInit={(siriwave) => (siriwaveRef.current = siriwave)} />
    </div>
  );
}

export default React.memo(DesktopAudioSiriWave);
