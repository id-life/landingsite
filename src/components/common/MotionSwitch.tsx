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
        // The ::before box extends the touch target to at least 44 px tall (WCAG 2.5.8, Apple's 44 pt).
        "pointer-events-auto relative flex h-10 shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold uppercase transition-colors duration-base before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] hover:text-accent mobile:h-8 mobile:gap-1 mobile:text-xs/5 mobile:before:-inset-y-1.5",
        className,
      )}
    >
      {/* The state, drawn: a track with its knob right (on) or left (off). */}
      <span aria-hidden="true" className="relative h-3.5 w-7 rounded-full border border-current mobile:h-3 mobile:w-5">
        <span
          className={cn(
            'absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-current transition-[left] duration-fast mobile:size-1.5',
            reduced ? 'left-0.5' : 'left-[0.9375rem] mobile:left-[0.6875rem]',
          )}
        />
      </span>
      {/* Narrow phones keep the track and give the word to assistive tech only, so the bar fits beside the logo. */}
      <span className="[@media(max-width:379px)]:sr-only">Motion</span>
    </button>
  );
}
