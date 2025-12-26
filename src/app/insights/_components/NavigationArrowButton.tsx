import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import { cn } from '@/utils';

interface NavigationArrowButtonProps {
  onClick: () => void;
  disabled: boolean;
  direction: 'prev' | 'next';
  className?: string;
}

export default function NavigationArrowButton({ onClick, disabled, direction, className }: NavigationArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/50 backdrop-blur-sm transition-opacity hover:bg-white/80 disabled:opacity-80 disabled:hover:bg-white/50',
        direction === 'prev' ? '-left-16' : '-right-16',
        className,
      )}
    >
      <ArrowDownSVG
        className={cn('size-5 fill-black', direction === 'prev' ? 'rotate-90' : '-rotate-90', { 'fill-[#999999]': disabled })}
      />
    </button>
  );
}
