'use client';

import CoverImage from '@/components/media/CoverImage';

type YouTubeThumbnailProps = {
  videoId: string;
  title: string;
  pic: string;
  onClick: () => void;
  /** Rendered width hint for next/image; defaults to a card in a multi-column grid. */
  sizes?: string;
};

/**
 * A video's static thumbnail. Hovering used to mount an autoplaying YouTube player after 500 ms, which loaded the
 * player and its third-party requests for every mouse pass; the player now loads only when the visitor opens it.
 */
export default function YouTubeThumbnail({
  videoId,
  title,
  onClick,
  pic,
  sizes = '(max-width: 768px) 45vw, 22vw',
}: YouTubeThumbnailProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative h-full cursor-pointer overflow-hidden rounded-sm" onClick={onClick}>
      <CoverImage
        src={videoId ? thumbnailUrl : pic}
        alt={title}
        sizes={sizes}
        className="transition-all duration-300 hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/10 to-purple/10" />
    </div>
  );
}
