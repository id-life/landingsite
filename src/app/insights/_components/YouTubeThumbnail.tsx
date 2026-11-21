'use client';

import CoverImage from '@/components/media/CoverImage';

type YouTubeThumbnailProps = {
  videoId: string;
  title: string;
  pic: string;
  /** Rendered width hint for next/image; defaults to a card in a multi-column grid. */
  sizes?: string;
};

/**
 * A video's static thumbnail, inside the card that opens the video. Hovering used to mount an autoplaying YouTube player after 500 ms, which loaded the
 * player and its third-party requests for every mouse pass; the player now loads only when the visitor opens it.
 */
export default function YouTubeThumbnail({
  videoId,
  title,
  pic,
  sizes = '(max-width: 768px) 45vw, 22vw',
}: YouTubeThumbnailProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    // Not a control: the card around it is the link that opens the video (CardShell).
    <div className="relative h-full cursor-pointer overflow-hidden rounded-sm">
      <CoverImage
        src={videoId ? thumbnailUrl : pic}
        alt={title}
        sizes={sizes}
        className="transition-all duration-300 hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-data-sky/10 to-data-purple/10" />
    </div>
  );
}
