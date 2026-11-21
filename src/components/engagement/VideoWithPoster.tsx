import { useAlphaClips } from '@/hooks/useSupportsWebm';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { useContext, useState } from 'react';
import { CardMeasureContext } from '@/hooks/anim/cardFit';
import { DURATION } from '@/motion/tokens';
import { useReducedMotionPref } from '@/motion/preference';
import { SECTIONS } from '@/motion/original';

interface VideoWithPosterProps {
  coverUrl?: string;
  videoUrl?: string;
  containerClass?: string;
  coverClass?: string;
  videoClass?: string;
  title?: string;
}

export function VideoWithPoster({ coverUrl, videoUrl, title, containerClass, coverClass, videoClass }: VideoWithPosterProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { playable: supportsWebm, url: clip } = useAlphaClips();
  // Reduced motion (MOT-02): the still cover instead of a looping clip.
  const reduced = useReducedMotionPref();
  // The map's measure layer: a box of the picture's size, nothing fetched.
  const measure = useContext(CardMeasureContext);

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: -30,
          scaleY: 0,
          transformOrigin: 'top',
        },
        visible: {
          opacity: 1,
          scaleY: 1,
          y: 0,
          transformOrigin: 'top',
        },
      }}
      transition={{
        duration: DURATION.base,
        ease: SECTIONS.mapDotEase,
      }}
      // className={cn('flex-center relative -mt-5 overflow-hidden')}
    >
      <div className={cn('flex-center relative -mt-5 overflow-hidden', containerClass)}>
        {measure && (coverUrl || videoUrl) && (
          <span data-card-picture className={cn('block size-[calc(var(--t)*15.5)]', coverUrl ? coverClass : videoClass)} />
        )}
        {!measure && coverUrl && (!videoLoaded || reduced) && (
          <img src={coverUrl} alt={title} className={cn('size-[calc(var(--t)*15.5)] object-contain', coverClass)} />
        )}
        {!measure && supportsWebm && !reduced && videoUrl && (
          <video
            src={clip(videoUrl)}
            autoPlay
            loop
            muted
            playsInline
            className={cn('size-[calc(var(--t)*15.5)] object-contain', videoLoaded ? 'block' : 'hidden', videoClass)}
            onLoadedData={() => setVideoLoaded(true)}
          />
        )}
      </div>
    </motion.div>
  );
}
