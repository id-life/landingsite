import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import { cn } from '@/utils';
import { useEffect, useRef } from 'react';

interface NavigationArrowButtonProps {
  onClick: () => void;
  disabled: boolean;
  direction: 'prev' | 'next';
  className?: string;
}

const TOUCH = 44; // the touch area's goal (RWD-06)
const TOUCH_MIN = 24; // WCAG 2.2 target size (2.5.8)

/**
 * The touch area of a row arrow reaches only into space that is nobody's: never into its own row's cards (on wide
 * windows the arrow is drawn over the cards' edge, and a centred 44 px area took the first 31 px of the first card),
 * and towards a neighbouring arrow only up to the middle of the space between them (on a tablet lying on its side the
 * PODCAST row's right arrow and the weekly row's left arrow sit 4 px apart). Measured from the page: the row's edge,
 * the neighbours, the window. The area is the arrow's own box plus what it may take, 44 px tall, and as wide as the
 * free space allows up to 44 px, never under 24 px. Written to two custom properties read by the coarse ::before.
 */
function fitTouchArea(button: HTMLButtonElement, direction: 'prev' | 'next') {
  const b = button.getBoundingClientRect();
  if (!b.width) return;
  const holder = button.parentElement;
  const row = holder?.querySelector('.swiper')?.getBoundingClientRect();
  const width = b.width;
  const need = Math.max(0, TOUCH - width);
  // The cards' edge on the arrow's inner side, and the nearest other row arrow on its outer side.
  const inner = row ? (direction === 'next' ? row.right : row.left) : direction === 'next' ? b.left : b.right;
  let outer = direction === 'next' ? window.innerWidth : 0;
  for (const other of document.querySelectorAll<HTMLElement>('[data-row-arrow]')) {
    if (other === button) continue;
    const o = other.getBoundingClientRect();
    if (!o.width || o.bottom < b.top - TOUCH / 2 || o.top > b.bottom + TOUCH / 2) continue;
    if (direction === 'next' && o.left >= b.right) outer = Math.min(outer, (b.right + o.left) / 2);
    if (direction === 'prev' && o.right <= b.left) outer = Math.max(outer, (b.left + o.right) / 2);
  }
  let left: number;
  let right: number;
  if (direction === 'next') {
    const inward = Math.max(0, Math.min(need, b.left - inner));
    // Where the arrow is drawn over the cards' edge, the area starts at that edge: above and below the overlapping part
    // are cards (the arrow's own drawn box is the button itself).
    left = Math.max(b.left - inward, inner);
    right = Math.min(outer, Math.max(b.right, left + TOUCH));
    if (right - left < TOUCH_MIN) right = Math.min(outer, left + TOUCH_MIN);
  } else {
    const inward = Math.max(0, Math.min(need, inner - b.right));
    right = Math.min(b.right + inward, inner);
    left = Math.max(outer, Math.min(b.left, right - TOUCH));
    if (right - left < TOUCH_MIN) left = Math.max(outer, right - TOUCH_MIN);
  }
  button.style.setProperty('--touch-left', `${(b.left - left).toFixed(1)}px`);
  button.style.setProperty('--touch-right', `${(right - b.right).toFixed(1)}px`);
}

/** Keeps an arrow's touch area fitted to the space that is nobody's (fitTouchArea), on both decks. */
function useFittedTouchArea(direction: 'prev' | 'next') {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const button = ref.current;
    if (!button) return;
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitTouchArea(button, direction));
    };
    fit();
    const late = setTimeout(fit, 1000);
    const observer = new ResizeObserver(fit);
    if (button.parentElement) observer.observe(button.parentElement);
    window.addEventListener('resize', fit);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [direction]);
  return ref;
}

/** The touch area classes: only into space that is nobody's (fitTouchArea), 44 px tall, on touch screens only. */
const FITTED_TOUCH_AREA =
  'coarse:before:!w-auto coarse:before:![left:calc(-1*var(--touch-left,0px))] coarse:before:![right:calc(-1*var(--touch-right,0px))] coarse:before:![transform:translateY(-50%)]';

export function PCNavigationArrowButton({ onClick, disabled, direction, className }: NavigationArrowButtonProps) {
  const ref = useFittedTouchArea(direction);
  return (
    <button
      ref={ref}
      data-row-arrow=""
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        // The original's circle on every pointer; on a touch screen its hit area grows to 44 px through ::before
        // (tap-area, RWD-06), so the control is no bigger than the owner drew it.
        'absolute top-1/2 z-10 flex size-7.5 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/50 backdrop-blur-sm transition-opacity tap-area hover:bg-white/80 disabled:opacity-80 disabled:hover:bg-white/50',
        direction === 'prev' ? '-left-16' : '-right-16',
        className,
        FITTED_TOUCH_AREA,
      )}
    >
      <ArrowDownSVG
        className={cn('size-5 fill-black', direction === 'prev' ? 'rotate-90' : '-rotate-90', {
          'fill-tone-350': disabled,
        })}
      />
    </button>
  );
}

export function MobileNavigationArrowButton({ onClick, disabled, direction, className }: NavigationArrowButtonProps) {
  // The phone's arrow is drawn over the edge of its row's first or last card (the owner's place, in the deck's unit
  // at every phone-deck width): its touch area reaches only outside the cards, so a tap on a card's edge opens the
  // card and a tap on the drawn arrow pages the row.
  const ref = useFittedTouchArea(direction);
  return (
    <button
      ref={ref}
      data-row-arrow=""
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        // The original's 32 px circle; the hit area grows to 44 px through ::before (tap-area, RWD-06), not the circle.
        'absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white fill-white tap-area disabled:bg-tone-50 disabled:fill-tone-350',
        direction === 'prev' ? '-left-5' : '-right-5',
        className,
        FITTED_TOUCH_AREA,
      )}
    >
      <ArrowDownSVG
        className={cn('size-4 fill-current', direction === 'prev' ? 'rotate-90' : '-rotate-90', { 'fill-tone-350': disabled })}
      />
    </button>
  );
}

export default PCNavigationArrowButton;
