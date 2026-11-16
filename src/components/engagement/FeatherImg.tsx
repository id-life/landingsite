import { cn } from '@/utils';
import React from 'react';
import maskImage from '../../../public/imgs/engagement/mask.png';

export default function FeatherImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      className={cn('aspect-[318/175] h-[calc(var(--t)*10.9375)] w-[calc(var(--t)*19.875)] object-cover', className)}
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
