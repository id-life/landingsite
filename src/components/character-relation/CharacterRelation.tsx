import { CharacterRelationImpression } from '@/apis/types';
import { isBePartOfItShowAtom } from '@/atoms/character-relation';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import BePartOfIt from './BePartOfIt';
import gsap from 'gsap';
import CharacterRelationGraph from './CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import CharacterRelationLegend from './CharacterRelationLegend';
import { cn } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { track } from '@/lib/analytics/track';
import { motion } from 'motion/react';
import { DURATION, EASE } from '@/motion/tokens';
import { u } from '@/utils/layout-unit';

export type IndividualType = 'visitor' | 'introducer' | 'all';

export interface Individuals {
  [character: string]: {
    count: number;
    type: IndividualType;
  };
}

interface Relation {
  from: string;
  to: string;
  impression: CharacterRelationImpression;
}

export interface CharacterRelationTransformedData {
  individuals: Individuals;
  relations: Relation[];
}

const CharacterRelation = () => {
  const isMobile = useIsMobile();

  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isBePartOfItShowAtom);

  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);

  const { data } = useFetchCharacterRelation();

  useEffect(() => {
    if (bePartOfItRef.current) {
      if (isBePartOfItShow) {
        bePartOfItTimelineRef.current.clear();
        gsap.set(bePartOfItRef.current, { bottom: '-100%' });
        bePartOfItTimelineRef.current.to(bePartOfItRef.current, { bottom: isMobile ? u(1.5) : u(2.5) });
        bePartOfItTimelineRef.current.play(0);
      } else {
        bePartOfItTimelineRef.current.reverse();
      }
    }
  }, [isBePartOfItShow, bePartOfItRef, isMobile]);

  // The form opens only on its own control (the owner's answer 6b, 2026-11-18): his site opened it by itself 3 s after
  // the graph mounted. Leaving the page closes it, so it is closed on the next visit.
  useEffect(() => () => setIsBePartOfItShow(false), [setIsBePartOfItShow]);

  const showBePartOfItBtnText = isMobile ? 'JOIN +' : 'BE PART OF IT +';

  const handleBePartOfItClose = () => {
    setIsBePartOfItShow(false);
  };

  const handleBePartOfItOpen = () => {
    setIsBePartOfItShow(true);
    track('relation_form_open');
  };

  return (
    <>
      <div className="h-full w-full">
        <div className={cn('h-full w-full px-10 py-[6.5rem]', 'mobile:px-0 mobile:pb-6 mobile:pt-20')}>
          {data && <CharacterRelationGraph data={data} />}
        </div>
        <CharacterRelationLegend />
      </div>

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
        {showBePartOfItBtnText}
      </motion.button>

      <BePartOfIt
        key="be-part-of-it-comp"
        ref={bePartOfItRef}
        onCountdownEnd={handleBePartOfItClose}
        onClose={handleBePartOfItClose}
      />
    </>
  );
};

export default CharacterRelation;
