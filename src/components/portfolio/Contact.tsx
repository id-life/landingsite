'use client';

import { useCopyToClipboard } from 'react-use';
import CopySVG from '@/../public/svgs/copy-btn.svg?component';
import CheckmarkSVG from '@/../public/svgs/checkmark.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { track } from '@/lib/analytics/track';
import { ORG_EMAIL } from '@/constants/contact';

interface ContactProps {
  onCopy?: () => void;
}

/**
 * The Portfolio contact chip, as on the original (the owner's answer 5h2): a press anywhere on it copies the address,
 * its icon turns into a check, and on the phone deck Portfolio shows "Copied successfully" (onCopy). It is one button
 * (the original's was a clickable div, out of reach of the keyboard); the address is not a mail link here, as on his
 * site. Connect's address stays a mail link (5h1).
 */
export default function Contact({ onCopy }: ContactProps) {
  const [state, copyToClipboard] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(ORG_EMAIL);
    track('contact_intent', { method: 'copy_email', placement: 'portfolio' });
    onCopy?.();
  };

  return (
    // The original chip at the original's sizes: 13 units wide, the address and the copy icon on its right; on phones
    // 7.125 units, the address at 10 px in capitals, clear of the section arrows; under 360 px wide, where the centred
    // pair of arrows reaches 134 px from the left (114 px at 320), 6.375 units, so it ends where the arrows begin
    // (RWD-11; its place, 12 px from the edge, is Portfolio's). Touch targets are hit areas
    // (tap-area), so the chip keeps its size; on the laptop deck its area does not grow upward or downward, because the
    // companies' tiles sit right above it.
    <button
      type="button"
      onClick={handleCopy}
      className="group relative block w-52 cursor-pointer bg-white/10 py-3.5 text-center text-base/5 font-semibold backdrop-blur duration-300 tap-area mobile:w-[7.125rem] mobile:text-xs/5 notMobile:hover:text-accent notMobile:coarse:before:h-full [@media(max-width:359.98px)]:w-[6.375rem]"
    >
      <SubscribeBorderSVG
        preserveAspectRatio="none"
        className="absolute inset-0 left-0 top-0 h-full w-full stroke-foreground duration-300 notMobile:group-hover:stroke-accent"
      />
      <span className="flex-center relative h-full w-full gap-4 mobile:gap-1">
        <span className="relative inline-flex w-36 items-center justify-center whitespace-nowrap mobile:w-[5.625rem] mobile:text-[.625rem]/3.5 mobile:uppercase">
          {ORG_EMAIL}
        </span>
        {/* Hidden on phones narrower than 386 px, where it would run into the section arrows. */}
        <span aria-hidden="true" className="relative flex items-center justify-center [@media(max-width:385px)]:hidden">
          {state.value ? (
            <CheckmarkSVG className="aspect-square size-3.5 stroke-white duration-300 notMobile:group-hover:stroke-accent" />
          ) : (
            <CopySVG className="aspect-square size-3.5 stroke-white duration-300 notMobile:group-hover:stroke-accent" />
          )}
        </span>
      </span>
    </button>
  );
}
