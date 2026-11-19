import { cn } from '@/utils';
import React, { useContext } from 'react';
import { CardMeasureContext } from '@/hooks/anim/cardFit';
import maskImage from '../../../public/imgs/engagement/mask.png';

export default function FeatherImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const sizeClass = cn('aspect-[318/175] h-[calc(var(--t)*10.9375)] w-[calc(var(--t)*19.875)] object-cover', className);
  // The map's measure layer: a box of the picture's size, nothing fetched.
  if (useContext(CardMeasureContext)) return <span data-card-picture className={cn('block', sizeClass)} />;
  return (
    <img
      className={sizeClass}
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        WebkitMaskImage: `url(${maskImage.src})`,
        WebkitMaskSize: '100% 100%',
        maskImage: `url(${maskImage.src})`,
        maskSize: '100% 100%',
      }}
    />
  );
}
