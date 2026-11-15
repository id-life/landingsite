'use client';

import { setMotionEnabled, useReducedMotionPref } from '@/motion/preference';
import { cn } from '@/utils';

/**
 * The on-page Motion switch (MOT-02, WCAG 2.2.2 pause-stop-hide): pressed while the experience moves; released, the
 * site runs its reduced-motion mode exactly as for a visitor whose system asks for less motion (section changes as
 * short crossfades, every canvas a still frame, no loops), without a reload. The choice is remembered on this device
 * and wins over the system setting (src/motion/preference.ts). One component for both headers: keep it when they
 * merge, early in the tab order.
 */
export default function MotionSwitch({ className }: { className?: string }) {
  const reduced = useReducedMotionPref();
  return (
    <button
      type="button"
      aria-pressed={!reduced}
      onClick={() => setMotionEnabled(reduced)}
      className={cn(
        'pointer-events-auto flex h-10 items-center gap-2 whitespace-nowrap text-sm font-bold uppercase transition-colors duration-base hover:text-accent mobile:h-8 mobile:text-xs/5',
        className,
      )}
    >
      {/* The state, drawn: a track with its knob right (on) or left (off). */}
      <span aria-hidden="true" className="relative h-3.5 w-7 rounded-full border border-current">
        <span
          className={cn(
            'absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-current transition-[left] duration-fast',
            reduced ? 'left-0.5' : 'left-[0.9375rem]',
          )}
        />
      </span>
      Motion
    </button>
  );
}
