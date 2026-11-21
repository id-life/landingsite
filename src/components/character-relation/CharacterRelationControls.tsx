'use client';

import { isBePartOfItShowAtom } from '@/atoms/character-relation';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';
import { track } from '@/lib/analytics/track';
import { DURATION, EASE } from '@/motion/tokens';
import { cn } from '@/utils';
import CharacterRelationLegend from './CharacterRelationLegend';

/**
 * The Influence Network's fixed controls: the legend and the button that opens the Be part of it form. They were drawn
 * by the graph's client-only chunk; here they render on the server too, so the page's fixed text is in its HTML (CON-14,
 * the lead's reading of 2026-11-21: that text, about 176 characters, is what the page holds without JavaScript; the
 * graph's names are fetched at run time and stay client-only). The form's open state is the shared atom, as before.
 * The button's two wordings follow the phone query in CSS, the query that chose them in JavaScript before.
 */
export default function CharacterRelationControls() {
  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isBePartOfItShowAtom);

  const handleBePartOfItOpen = () => {
    setIsBePartOfItShow(true);
    track('relation_form_open');
  };

  return (
    <>
      <CharacterRelationLegend />
      <motion.button
        className={cn(
          'fixed bottom-10 left-1/2 z-[10] -translate-x-1/2',
          'w-[11.625rem] rounded-full bg-accent py-3 text-center font-text text-base/5 font-bold tracking-normal text-white',
          'mobile:bottom-6 mobile:left-[auto] mobile:right-5 mobile:w-[7.125rem] mobile:-translate-x-0',
        )}
        onClick={handleBePartOfItOpen}
        // Faded out (and click-through) while the form is open: out of the Tab order and the accessibility tree too.
        tabIndex={isBePartOfItShow ? -1 : undefined}
        aria-hidden={isBePartOfItShow || undefined}
        animate={{
          opacity: isBePartOfItShow ? 0 : 1,
          pointerEvents: isBePartOfItShow ? 'none' : 'auto',
        }}
        transition={{ duration: DURATION.base, ease: EASE.inOut }}
      >
        <span className="mobile:hidden">BE PART OF IT +</span>
        <span className="hidden mobile:inline">JOIN +</span>
      </motion.button>
    </>
  );
}
