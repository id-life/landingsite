import React, { memo, useRef } from 'react';
import SiriWave from 'siriwave';
import Siriwave from '@/components/common/Siriwave';

type PodcastSiriWaveProps = {
  status: boolean;
};

function PodcastSiriWave({ status }: PodcastSiriWaveProps) {
  const siriwaveRef = useRef<SiriWave | null>(null);

  return (
    <div className="relative h-10 w-30 overflow-hidden mobile:w-16">
      <div className="absolute left-1/2 top-1/2 mt-0.75 -translate-x-1/2 -translate-y-1/2">
        <Siriwave
          width={120}
          amplitude={status ? 1.5 : 0}
          height={40}
          theme="ios9"
          onInit={(siriwave) => {
            siriwaveRef.current = siriwave;
            // Paused: draw one frame (the flat line) and stop. The wave's animation loop otherwise runs every frame at
            // amplitude 0, which was most of the episode page's main-thread time on a phone (Lighthouse bootup).
            if (!status) requestAnimationFrame(() => siriwave.stop());
          }}
        />
      </div>
    </div>
  );
}

export default memo(PodcastSiriWave);
