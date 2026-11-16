import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import { cn } from '@/utils';

interface NavigationArrowButtonProps {
  onClick: () => void;
  disabled: boolean;
  direction: 'prev' | 'next';
  className?: string;
}

export function PCNavigationArrowButton({ onClick, disabled, direction, className }: NavigationArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        // A 44 px box on coarse pointers (RWD-06); the mouse layout keeps its scaled size.
        'absolute top-1/2 z-10 flex size-7.5 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/50 backdrop-blur-sm transition-opacity tap hover:bg-white/80 disabled:opacity-80 disabled:hover:bg-white/50',
        direction === 'prev' ? '-left-16' : '-right-16',
        className,
        // Medium and expanded windows: in the px margin beside the row, clear of the cards (a 44 px touch box
        // overlapping the first card covered its title).
        direction === 'prev' ? 'medium:-left-[54px] expanded:-left-[58px]' : 'medium:-right-[54px] expanded:-right-[58px]',
        // and drawn in px there, as the cards beside them (the scaled circle was 20 px at 820 px).
        'medium:size-[32px] expanded:size-[32px]',
      )}
    >
      <ArrowDownSVG
        className={cn(
          'size-5 fill-black medium:size-[20px] expanded:size-[20px]',
          direction === 'prev' ? 'rotate-90' : '-rotate-90',
          {
            'fill-tone-350': disabled,
          },
        )}
      />
    </button>
  );
}

export function MobileNavigationArrowButton({ onClick, disabled, direction, className }: NavigationArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        // The original's 32 px circle; the hit area grows to 44 px through ::before (tap-area, RWD-06), not the circle.
        'absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white fill-white tap-area disabled:bg-tone-50 disabled:fill-tone-350',
        direction === 'prev' ? '-left-5' : '-right-5',
        className,
      )}
    >
      <ArrowDownSVG
        className={cn('size-4 fill-current', direction === 'prev' ? 'rotate-90' : '-rotate-90', { 'fill-tone-350': disabled })}
      />
    </button>
  );
}

export default PCNavigationArrowButton;
