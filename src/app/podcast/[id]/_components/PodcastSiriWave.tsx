import React, { memo, useRef } from 'react';
import SiriWave from 'siriwave';
import Siriwave from '@/components/common/Siriwave';

type PodcastSiriWaveProps = {
  status: boolean;
};

function PodcastSiriWave({ status }: PodcastSiriWaveProps) {
  const siriwaveRef = useRef<SiriWave | null>(null);

  return (
    <div className="relative h-[40px] w-[120px] overflow-hidden">
      <div className="absolute left-1/2 top-1/2 mt-[3px] -translate-x-1/2 -translate-y-1/2">
        <Siriwave
          width={120}
          amplitude={status ? 1.5 : 0}
          height={40}
          theme="ios9"
          onInit={(siriwave) => (siriwaveRef.current = siriwave)}
        />
      </div>
    </div>
  );
}

export default memo(PodcastSiriWave);
