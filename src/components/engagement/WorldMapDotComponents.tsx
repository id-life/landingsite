import { motion } from 'motion/react';
import { MouseEvent } from 'react';
import { cn } from '@/utils';
import { MeetingSVG, SponsorSVG, ArrowSVG } from '../svg';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import { VideoWithPoster } from './VideoWithPoster';
import FeatherImg from './FeatherImg';
import { MOBILE_MAP_SCALE } from '@/constants/engagement';

// ============================================================================
// Shared Components (Desktop & Mobile)
// ============================================================================

// Pulsing dot SVG animation with center point and ripple effects
export function PulseDot({
  svgSize,
  centerPoint,
  centerRadius,
  color,
  pulse1,
  pulse2,
  isActive,
  containerClassName,
  svgClassName = 'absolute -left-full -top-full size-18',
}: {
  svgSize: number;
  centerPoint: number;
  centerRadius: number;
  color: string;
  pulse1: { fromRadius: number; toRadius: number; duration: number };
  pulse2: { fromRadius: number; toRadius: number; duration: number };
  isActive?: boolean;
  containerClassName?: string;
  svgClassName?: string;
}) {
  return (
    <div
      className={cn(
        'pulse-dot relative',
        containerClassName ?? MOBILE_MAP_SCALE.dotContainerSize,
        isActive ? 'overflow-visible' : 'overflow-hidden',
      )}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className={svgClassName}>
        <circle cx={centerPoint} cy={centerPoint} r={centerRadius} fill={color} />
        {isActive && (
          <>
            {/* 使用SVG animate元素来创建平滑的波纹效果 */}
            <circle cx={centerPoint} cy={centerPoint} r={pulse1.fromRadius} fill={color} opacity="0.5">
              <animate
                attributeName="r"
                from={pulse1.fromRadius}
                to={pulse1.toRadius}
                dur={`${pulse1.duration}s`}
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur={`${pulse1.duration}s`}
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={centerPoint}
              cy={centerPoint}
              r={pulse2.fromRadius}
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                from={pulse2.fromRadius}
                to={pulse2.toRadius}
                dur={`${pulse2.duration}s`}
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur={`${pulse2.duration}s`}
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

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
            {/*{period}*/}
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

// ============================================================================
// Mobile Components
// ============================================================================

// Mobile conference badges and video button (inline version for mobile)
export function MobileConferenceBadgesWithVideo({
  isSponsor,
  extraSponsor,
  videoUrl,
  onVideoClick,
}: {
  isSponsor?: boolean;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string };
  videoUrl?: string;
  onVideoClick?: (e: MouseEvent) => void;
}) {
  return (
    <div className="absolute top-[calc(100%_+_0.25rem)] flex flex-col items-start gap-2">
      <div
        className={cn(
          'relative flex items-center gap-1 rounded-lg bg-purple/20 px-2 py-1',
          MOBILE_MAP_SCALE.badgeTextClass,
          'font-semibold text-purple backdrop-blur-2xl',
        )}
      >
        <MeetingSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-purple')} />
        Conference
      </div>
      {(isSponsor || extraSponsor) && (
        <div
          className={cn(
            'relative flex items-center gap-1 rounded-lg bg-orange/20 px-2 py-1',
            MOBILE_MAP_SCALE.badgeTextClass,
            'font-semibold text-orange backdrop-blur-2xl',
          )}
        >
          <SponsorSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-orange')} />
          Sponsorship
        </div>
      )}
      {videoUrl && onVideoClick && (
        <motion.a
          href={videoUrl}
          target="_blank"
          onClick={onVideoClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.85 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="pointer-events-auto flex cursor-pointer flex-col"
        >
          <div className="clip-talk-content -ml-1 bg-white p-0.5">
            <div className="clip-talk-content flex items-center gap-1 bg-[#0F0F0F] px-3.5 py-2.5 [--clip-offset:.75rem]">
              <YoutubeSVG className="size-5 fill-white" />
              <span className="inline-block text-base/5 font-semibold text-white">Talk</span>
              <ArrowSVG className="size-4 -rotate-90 fill-white" />
            </div>
          </div>
        </motion.a>
      )}
    </div>
  );
}

// Mobile content section with images
export function MobileContentSection({
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
      className={cn('flex h-full', MOBILE_MAP_SCALE.contentMaxWidth, 'flex-col items-center gap-4 font-oxanium')}
    >
      {title && (
        <h3
          className={cn(
            'cursor-pointer whitespace-nowrap text-center',
            MOBILE_MAP_SCALE.contentTitleClass,
            'font-semibold capitalize text-white',
          )}
        >
          <span className="mr-2 whitespace-pre-wrap">{title}</span>
          {/*{period}*/}
        </h3>
      )}
      <a
        href={link}
        target="_blank"
        className="hide-scrollbar pointer-events-auto h-full grow overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_90%,transparent)]"
        onClick={onClick}
      >
        {imgs?.length ? (
          <div
            ref={scrollContainerRef}
            className="pointer-events-auto flex flex-col [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_75%,transparent)]"
          >
            {imgs.map((img) => (
              <FeatherImg className={MOBILE_MAP_SCALE.contentImageClass} key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        ) : null}
      </a>
    </motion.div>
  );
}
