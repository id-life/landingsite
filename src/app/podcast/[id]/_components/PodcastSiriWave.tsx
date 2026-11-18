import React, { memo, useEffect, useRef, useState } from 'react';
import type SiriWave from 'siriwave';
import Siriwave from '@/components/common/Siriwave';
import { useIsMobile } from '@/hooks/useIsMobile';

type PodcastSiriWaveProps = {
  status: boolean;
};

function PodcastSiriWave({ status }: PodcastSiriWaveProps) {
  const siriwaveRef = useRef<SiriWave | null>(null);
  // The wave mounts with the page, so the paused player shows its thin flat line from the start, as it always has.
  // Its library still loads on its own after the page (PERF-10), and the idle wave stops its draw loop below.

  // The wave's canvas is drawn at a size in pixels. On the phone deck it follows the deck's unit like the rest of the
  // player (an upright tablet shows the phone version proportionally larger): its box is 7.5rem wide there (120 px at
  // phone widths, unchanged), and the canvas is drawn at the width that box measures. The laptop deck keeps 120x40.
  const isPhoneDeck = useIsMobile() === true;
  const boxRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(120);
  const waveWidth = isPhoneDeck ? measuredWidth : 120;
  useEffect(() => {
    const box = boxRef.current;
    if (!isPhoneDeck || !box || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const width = Math.round(box.getBoundingClientRect().width * 10) / 10;
      if (width > 0) setMeasuredWidth((current) => (Math.abs(current - width) > 0.5 ? width : current));
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [isPhoneDeck]);

  return (
    <div className="relative h-10 w-30 overflow-hidden mobile:w-16">
      <div ref={boxRef} className="absolute left-1/2 top-1/2 mt-0.75 -translate-x-1/2 -translate-y-1/2 mobile:w-30">
        <Siriwave
          width={waveWidth}
          amplitude={status ? 1.5 : 0}
          height={waveWidth / 3}
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
