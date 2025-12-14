'use client';

import { cn } from '@/utils';

type MobileInsightsNavProps = {
  activeIndex: number;
  onNavClick: (index: number) => void;
};

export default function MobileInsightsNav({ activeIndex, onNavClick }: MobileInsightsNavProps) {
  return (
    <div className="flex-center gap-3 py-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavClick(index)}
          className={cn('h-0.5 w-6 transition-all duration-300', {
            'bg-foreground': index === activeIndex,
            'bg-gray-250': index !== activeIndex,
          })}
        />
      ))}
    </div>
  );
}
