import { CharacterRelationImpression } from '@/apis/types';
import { isBePartOfItShowAtom } from '@/atoms/character-relation';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import BePartOfIt from './BePartOfIt';
import gsap from 'gsap';
import CharacterRelationGraph from './CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import { cn } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
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

  const handleBePartOfItClose = () => {
    setIsBePartOfItShow(false);
  };

  // The legend and the button that opens the form render on the server, beside this chunk (CharacterRelationControls).
  return (
    <>
      <div className="h-full w-full">
        <div className={cn('h-full w-full px-10 py-[6.5rem]', 'mobile:px-0 mobile:pb-6 mobile:pt-20')}>
          {data && <CharacterRelationGraph data={data} />}
        </div>
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
