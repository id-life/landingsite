import { CharacterRelationImpression } from '@/apis/types';
import { isBePartOfItShowAtom, isBePartOfItSubmittedAtom } from '@/atoms/character-relation';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import BePartOfIt from './BePartOfIt';
import gsap from 'gsap';
import CharacterRelationGraph from './CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import CharacterRelationLegend from './CharacterRelationLegend';

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
  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isBePartOfItShowAtom);
  const isBePartOfItSubmitted = useAtomValue(isBePartOfItSubmittedAtom);

  const bePartOfItTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useFetchCharacterRelation();

  useEffect(() => {
    if (bePartOfItRef.current) {
      if (isBePartOfItShow) {
        bePartOfItTimelineRef.current.clear();
        gsap.set(bePartOfItRef.current, { bottom: '-16.5rem' });
        bePartOfItTimelineRef.current.to(bePartOfItRef.current, { bottom: '2.4rem' });
        bePartOfItTimelineRef.current.play(0);
      } else {
        bePartOfItTimelineRef.current.reverse();
      }
    }
  }, [isBePartOfItShow, bePartOfItRef]);

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
  }, [isBePartOfItSubmitted, setIsBePartOfItShow, resetBePartOfItTimer, refetch]);

  const handleBePartOfItClose = () => {
    setIsBePartOfItShow(false);
  };

  const handleBePartOfItOpen = () => {
    setIsBePartOfItShow(true);
  };

  return (
    <>
      <div className="character-relation-css-vars-inject h-full w-full">
        <div className="character-relation-graph-wrapper h-full w-full px-10 py-[6.5rem]">
          {data && <CharacterRelationGraph data={data} />}
        </div>
        <CharacterRelationLegend />
      </div>

      <div className="fixed bottom-10 left-1/2 z-[10] flex -translate-x-1/2 items-center gap-x-7.5">
        <button
          className="w-[11.625rem] rounded-full bg-red-600 py-3 text-center font-poppins text-base/5 font-bold tracking-normal text-white"
          onClick={handleBePartOfItOpen}
        >
          BE PART OF IT +
        </button>
      </div>

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
