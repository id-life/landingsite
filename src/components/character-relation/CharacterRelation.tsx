import { CharacterRelationImpression } from '@/apis/types';
import { isBePartOfItShowAtom, isBePartOfItSubmittedAtom } from '@/atoms/character-relation';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import BePartOfIt from './BePartOfIt';
import gsap from 'gsap';
import CharacterRelationGraph from './CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import CharacterRelationLegend from './CharacterRelationLegend';
import { cn } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { motion } from 'motion/react';

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
  const { trackEvent } = useGA();

  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isBePartOfItShowAtom);
  const isBePartOfItSubmitted = useAtomValue(isBePartOfItSubmittedAtom);

  const bePartOfItTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);

  const { data } = useFetchCharacterRelation();

  useEffect(() => {
    if (bePartOfItRef.current) {
      if (isBePartOfItShow) {
        bePartOfItTimelineRef.current.clear();
        gsap.set(bePartOfItRef.current, { bottom: '-100%' });
        bePartOfItTimelineRef.current.to(bePartOfItRef.current, { bottom: isMobile ? '1.5rem' : '2.5rem' });
        bePartOfItTimelineRef.current.play(0);
      } else {
        bePartOfItTimelineRef.current.reverse();
      }
    }
  }, [isBePartOfItShow, bePartOfItRef, isMobile]);

  const resetBePartOfItTimer = useCallback(() => {
    if (bePartOfItTimerRef.current) {
      clearTimeout(bePartOfItTimerRef.current);
      bePartOfItTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isBePartOfItSubmitted) {
      // show BePartOfIt after 3 seconds when character relation is shown
      bePartOfItTimerRef.current = setTimeout(() => {
        setIsBePartOfItShow(true);
      }, 3000);
    } else {
      resetBePartOfItTimer();
    }

    return () => {
      resetBePartOfItTimer();
      setIsBePartOfItShow(false);
    };
  }, [isBePartOfItSubmitted, setIsBePartOfItShow, resetBePartOfItTimer]);

  const showBePartOfItBtnText = isMobile ? 'JOIN +' : 'BE PART OF IT +';

  const handleBePartOfItClose = () => {
    setIsBePartOfItShow(false);
  };

  const handleBePartOfItOpen = () => {
    setIsBePartOfItShow(true);
    trackEvent({ name: GA_EVENT_NAMES.IN_POPUP });
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
          'w-[11.625rem] rounded-full bg-red-600 py-3 text-center font-poppins text-base/5 font-bold tracking-normal text-white',
          'mobile:bottom-6 mobile:left-[auto] mobile:right-5 mobile:w-[7.125rem] mobile:-translate-x-0',
        )}
        onClick={handleBePartOfItOpen}
        animate={{
          opacity: isBePartOfItShow ? 0 : 1,
          pointerEvents: isBePartOfItShow ? 'none' : 'auto',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
