'use client';

import { useCopyToClipboard } from 'react-use';
import CopySVG from '@/../public/svgs/copy-btn.svg?component';
import CheckmarkSVG from '@/../public/svgs/checkmark.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { track } from '@/lib/analytics/track';
import { ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';

interface ContactProps {
  onCopy?: () => void;
}

/**
 * The Portfolio contact chip: the address is a mailto link and the icon a copy button (the whole chip used to be a
 * clickable div that only copied). On phones the text is 12 px in lower case (it was 10 px capitals).
 */
export default function Contact({ onCopy }: ContactProps) {
  const [state, copyToClipboard] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(ORG_EMAIL);
    track('contact_intent', { method: 'copy_email', placement: 'portfolio' });
    onCopy?.();
  };

  return (
    // Phones: the chip sizes to its content and must end left of the 44 px section arrows (bottom centre).
    <div className="group relative w-52 bg-white/10 py-3.5 text-center text-base/5 font-semibold backdrop-blur duration-300 mobile:w-auto mobile:px-1 mobile:text-xs/5 notMobile:hover:text-accent">
      <SubscribeBorderSVG
        preserveAspectRatio="none"
        className="absolute inset-0 left-0 top-0 h-full w-full stroke-foreground duration-300 notMobile:group-hover:stroke-accent"
      />
      <div className="flex-center relative h-full w-full gap-4 mobile:gap-1">
        <a href={ORG_MAILTO} data-track-placement="portfolio" className="w-36 mobile:w-auto">
          {ORG_EMAIL}
        </a>
        <button
          type="button"
          aria-label={state.value ? 'Email address copied' : 'Copy email address'}
          onClick={handleCopy}
          // Hidden on phones narrower than 386 px, where it would run into the section arrows; the address stays a
          // mailto link (and can be long-pressed to copy).
          className="relative flex cursor-pointer before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] [@media(max-width:385px)]:hidden"
        >
          {state.value ? (
            <CheckmarkSVG
              aria-hidden="true"
              className="aspect-square size-3.5 stroke-white duration-300 notMobile:group-hover:stroke-accent"
            />
          ) : (
            <CopySVG
              aria-hidden="true"
              className="aspect-square size-3.5 stroke-white duration-300 notMobile:group-hover:stroke-accent"
            />
          )}
        </button>
      </div>
    </div>
  );
}
