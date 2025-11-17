import { motion } from 'motion/react';
import { MouseEvent } from 'react';
import { cn } from '@/utils';
import { MeetingSVG, SponsorSVG, ArrowSVG } from '../svg';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import { VideoWithPoster } from './VideoWithPoster';
import FeatherImg from './FeatherImg';

// ============================================================================
// Desktop Components
// ============================================================================

// Conference and Sponsor badges that appear on hover
export function ConferenceBadges({
  isSponsor,
  extraSponsor,
}: {
  isSponsor?: boolean;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string };
}) {
  return (
    <motion.div className="absolute -left-0.5 top-[calc(100%_+_0.25rem)] flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 0.83 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="flex items-center gap-1 rounded-lg bg-purple/20 p-1 px-2 py-1 text-base/5 font-semibold text-purple backdrop-blur-2xl"
      >
        <MeetingSVG className="size-5 fill-purple" />
        Conference
      </motion.div>
      {(isSponsor || extraSponsor) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.83 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="-ml-1.5 flex items-center gap-1 rounded-lg bg-orange/20 p-1 px-2 py-1 text-base/5 font-semibold text-orange backdrop-blur-2xl"
        >
          <SponsorSVG className="size-5 fill-orange" />
          Sponsorship
        </motion.div>
      )}
    </motion.div>
  );
}

// Talk video button that appears in the content popup
export function VideoTalkButton({ videoUrl, onClick }: { videoUrl: string; onClick: (e: MouseEvent) => void }) {
  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 0.85 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="-left-[calc(100%_-_3.75rem)]x pointer-events-auto absolute top-[calc(22dvh_+_5rem)] z-10 flex cursor-pointer flex-col items-center"
    >
      <div className="clip-talk-content bg-white p-0.5">
        <div className="clip-talk-content flex items-center gap-1 bg-[#0F0F0F] px-3.5 py-2.5 [--clip-offset:.75rem]">
          <YoutubeSVG className="size-5 fill-white" />
          <span className="inline-block text-base/5 font-semibold text-white">Talk</span>
          <ArrowSVG className="size-4 -rotate-90 fill-white" />
        </div>
      </div>
    </motion.a>
  );
}

// Main or secondary content section with images
export function ContentSection({
  title,
  period,
  imgs,
  link,
  scrollContainerRef,
  onClick,
}: {
  title?: string;
  period?: string;
  imgs?: { src: string; alt: string }[];
  link?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  onClick: (e: MouseEvent) => void;
}) {
  return (
    <a href={link} target="_blank" className="pointer-events-auto" onClick={onClick}>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: {
            opacity: 0,
            height: 0,
          },
          visible: {
            opacity: 1,
            height: '70dvh',
          },
        }}
        transition={{
          staggerChildren: 0.1,
          duration: 0.3,
          type: 'easeInOut',
        }}
        className={cn('flex h-full w-[20.25rem] origin-top-left flex-col items-center gap-4 font-oxanium')}
      >
        {title && (
          <h3 className="whitespace-nowrap text-center text-xl/6 font-semibold capitalize text-white">
            <span className="mr-2 whitespace-pre-wrap">{title}</span>
            {period}
          </h3>
        )}
        {imgs?.length ? (
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar pointer-events-auto flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_75%,transparent)]"
          >
            {imgs.map((img) => (
              <FeatherImg key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        ) : null}
      </motion.div>
    </a>
  );
}

// Extra sponsor section with video
export function ExtraSponsorSection({
  extraSponsor,
  onClick,
  className,
}: {
  extraSponsor: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
  };
  onClick: (e: MouseEvent) => void;
  className?: string;
}) {
  return (
    <a
      href={extraSponsor.link}
      target="_blank"
      rel="noreferrer"
      className={cn('pointer-events-auto absolute -right-[90%] top-0 overflow-visible', className)}
      onClick={onClick}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="flex w-[17rem] origin-top-left flex-col items-center overflow-visible font-oxanium"
        variants={{
          hidden: {
            opacity: 0,
            y: -10,
            transformOrigin: 'top left',
          },
          visible: {
            opacity: 1,
            y: 0,
            transformOrigin: 'top left',
          },
        }}
        transition={{
          staggerChildren: 0.05,
          duration: 0.3,
          type: 'easeInOut',
        }}
      >
        <h4 className="-mx-10 whitespace-pre-wrap text-center text-xl/6 font-semibold capitalize text-white">
          {extraSponsor.alt}
        </h4>
        <VideoWithPoster
          coverUrl={extraSponsor.coverUrl}
          videoUrl={extraSponsor.videoUrl}
          title={extraSponsor.alt}
          containerClass="-mt-5"
          videoClass="size-[15.5rem]"
          coverClass="size-[15.5rem]"
        />
      </motion.div>
    </a>
  );
}

// Hot areas for click/hover interactions
export function ContentHotAreas({
  link,
  pcDotHotAreaClass,
  videoUrl,
  extraSponsor,
  onClick,
}: {
  link?: string;
  pcDotHotAreaClass?: string;
  videoUrl?: string;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string };
  onClick: (e: MouseEvent) => void;
}) {
  return (
    <>
      <a
        href={link}
        target="_blank"
        className="pointer-events-auto absolute -inset-4 bottom-auto z-10 h-[38dvh] cursor-pointer"
      ></a>
      <div className="pointer-events-auto absolute -inset-10 cursor-pointer"></div>
      <div
        className={cn('pointer-events-auto absolute -right-80 left-full h-20', pcDotHotAreaClass, {
          'top-[22dvh] h-36': videoUrl,
        })}
        onClick={onClick}
      ></div>
      {extraSponsor && (
        <a
          href={extraSponsor.link}
          target="_blank"
          className="pointer-events-auto absolute -right-[90%] top-0 h-[40dvh] w-[17rem] cursor-pointer"
        ></a>
      )}
    </>
  );
}
