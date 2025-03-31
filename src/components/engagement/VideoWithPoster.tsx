import { useIsMounted } from '@/hooks/useIsMounted';
import { cn, judgeIsWebView } from '@/utils';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { CustomView, isSafari } from 'react-device-detect';

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
  const isMounted = useIsMounted();

  const isWebView = useMemo(() => {
    if (isMounted) return judgeIsWebView();
    return false;
  }, [isMounted]);

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
      className={cn('flex-center relative -mt-5 overflow-hidden', containerClass)}
    >
      {coverUrl && !videoLoaded && (
        <img src={coverUrl} alt={title} className={cn('size-[15.5rem] object-contain', coverClass)} />
      )}
      <CustomView condition={!isSafari && !isWebView}>
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
    </motion.div>
  );
}
