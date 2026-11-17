import { useSupportsWebm } from '@/hooks/useSupportsWebm';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import { DURATION, EASE } from '@/motion/tokens';
import { useReducedMotionPref } from '@/motion/preference';

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
  const supportsWebm = useSupportsWebm();
  // Reduced motion (MOT-02): the still cover instead of a looping clip.
  const reduced = useReducedMotionPref();

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
        ease: EASE.inOut,
      }}
      // className={cn('flex-center relative -mt-5 overflow-hidden')}
    >
      <div className={cn('flex-center relative -mt-5 overflow-hidden', containerClass)}>
        {coverUrl && (!videoLoaded || reduced) && (
          <img src={coverUrl} alt={title} className={cn('size-[calc(var(--t)*15.5)] object-contain', coverClass)} />
        )}
        {supportsWebm && !reduced && videoUrl && (
          <video
            src={videoUrl}
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
