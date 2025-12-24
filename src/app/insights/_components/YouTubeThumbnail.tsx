'use client';

import { useState, useRef, useCallback } from 'react';

type YouTubeThumbnailProps = {
  videoId: string;
  title: string;
  pic: string;
  onClick: () => void;
};

export default function YouTubeThumbnail({ videoId, title, onClick, pic }: YouTubeThumbnailProps) {
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowPreview(false);
  }, []);

  return (
    <div
      className="relative h-full cursor-pointer overflow-hidden rounded-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <img
        src={videoId ? thumbnailUrl : pic}
        alt={title}
        className={`size-full object-cover transition-all duration-300 hover:scale-105`}
      />
      {videoId && showPreview && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${videoId}&disablekb=1&fs=0&iv_load_policy=3`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/10 to-purple/10" />
    </div>
  );
}
