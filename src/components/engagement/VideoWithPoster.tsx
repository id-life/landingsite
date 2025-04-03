import { useSupportsWebm } from '@/hooks/useSupportsWebm';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import { CustomView } from 'react-device-detect';

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
        duration: 0.3,
        type: 'easeInOut',
      }}
      // className={cn('flex-center relative -mt-5 overflow-hidden')}
    >
      <div className={cn('flex-center relative -mt-5 overflow-hidden', containerClass)}>
        {coverUrl && !videoLoaded && (
          <img src={coverUrl} alt={title} className={cn('size-[15.5rem] object-contain', coverClass)} />
        )}
        <CustomView condition={supportsWebm}>
          {videoUrl && (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className={cn('size-[15.5rem] object-contain', videoLoaded ? 'block' : 'hidden', videoClass)}
              onLoadedData={() => setVideoLoaded(true)}
            />
          )}
        </CustomView>
      </div>
    </motion.div>
  );
}
