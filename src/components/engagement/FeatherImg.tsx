import { cn } from '@/utils';
import React from 'react';

export default function FeatherImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // SVG使用foreignObject嵌入CSS实现边缘羽化效果
  const featherMaskSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3CforeignObject width='100%25' height='100%25'%3E%3Cbody class='wrap' xmlns='http://www.w3.org/1999/xhtml'%3E%3Cstyle%3E.wrap%7Bbox-sizing:border-box;margin:0;height:100%25;padding:10px 12px%7D.shadow%7Bheight:100%25;background:%23000;border-radius:20px;box-shadow:0 0 5px %23000,0 0 10px %23000,0 0 15px %23000%7D%3C/style%3E%3Cdiv class='shadow'/%3E%3C/body%3E%3C/foreignObject%3E%3C/svg%3E`;

  return (
    <div className={cn('relative h-auto', className)}>
      <img
        className="w-full"
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          WebkitMaskImage: `url("${featherMaskSvg}")`,
          maskImage: `url("${featherMaskSvg}")`,
        }}
      />
    </div>
  );
}
