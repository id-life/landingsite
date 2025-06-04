import { CharacterRelationImpression } from '@/apis/types';
import { isBePartOfItShowAtom, isBePartOfItSubmittedAtom, isCharacterRelationShowAtom } from '@/atoms/character-relation';
import Background from '@/components/common/Background';
import { useFloating, FloatingPortal } from '@floating-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import BePartOfIt from './BePartOfIt';
import gsap from 'gsap';
import CharacterRelationGraph from './CharacterRelationGraph';
import { currentPageIndexAtom } from '@/atoms';
import { SPECTRUM_PAGE_INDEX } from '@/constants/config';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import { AnimatePresence, motion } from 'motion/react';

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
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const isCharacterRelationShow = useAtomValue(isCharacterRelationShowAtom);
  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isBePartOfItShowAtom);
  const isBePartOfItSubmitted = useAtomValue(isBePartOfItSubmittedAtom);

  const bePartOfItTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating();
  const { data } = useFetchCharacterRelation();

  const [clipPathValue, setClipPathValue] = useState<string>('circle(0px at 50% 50%)');
  const createClipPath = useCallback((isOpening: boolean) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const maxRadius = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY),
    );

    return isOpening ? `circle(${maxRadius}px at ${centerX}px ${centerY}px)` : `circle(0px at ${centerX}px ${centerY}px)`;
  }, []);

  useEffect(() => {
    if (bePartOfItRef.current) {
      if (isBePartOfItShow) {
        bePartOfItTimelineRef.current.clear();
        gsap.set(bePartOfItRef.current, { bottom: '-16.5rem' });
        bePartOfItTimelineRef.current.to(bePartOfItRef.current, { bottom: '8rem' });
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
    if (currentPageIndex !== SPECTRUM_PAGE_INDEX) return;

    if (isCharacterRelationShow) {
      setClipPathValue(createClipPath(true));

      if (!isBePartOfItSubmitted) {
        // show BePartOfIt after 3 seconds when character relation is shown
        bePartOfItTimerRef.current = setTimeout(() => {
          setIsBePartOfItShow(true);
        }, 3000);
      } else {
        resetBePartOfItTimer();
      }
    } else {
      setClipPathValue(createClipPath(false));
      resetBePartOfItTimer();
      setIsBePartOfItShow(false);
    }

    return () => {
      resetBePartOfItTimer();
    };
  }, [
    isCharacterRelationShow,
    currentPageIndex,
    isBePartOfItSubmitted,
    createClipPath,
    setIsBePartOfItShow,
    resetBePartOfItTimer,
  ]);

  const handleBePartOfItClose = useCallback(() => {
    if (isBePartOfItShow) {
      setIsBePartOfItShow(false);
    }
  }, [isBePartOfItShow, setIsBePartOfItShow]);

  return (
    <FloatingPortal key="character-relation-portal">
      <AnimatePresence>
        <motion.div
          key="character-relation-motion-wrapper"
          animate={isCharacterRelationShow ? 'open' : 'close'}
          variants={{
            open: {
              zIndex: 50,
              opacity: 1,
              clipPath: clipPathValue,
              top: 0,
            },
            close: {
              zIndex: 50,
              opacity: 1,
              clipPath: clipPathValue,
              top: 0,
            },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          className="character-relation-css-vars-inject fixed -top-full left-0 h-full w-full"
        >
          <Background />
          <div ref={refs.setFloating} style={floatingStyles} className="character-relation-graph-wrapper h-full w-full">
            {isCharacterRelationShow && <CharacterRelationGraph data={data} />}
          </div>
        </motion.div>
        {isCharacterRelationShow && (
          <BePartOfIt
            key="be-part-of-it-comp"
            ref={bePartOfItRef}
            onCountdownEnd={handleBePartOfItClose}
            onClose={handleBePartOfItClose}
          />
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

export default CharacterRelation;
