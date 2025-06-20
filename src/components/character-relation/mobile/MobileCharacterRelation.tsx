'use client';

import {
  isMobileBePartOfItShowAtom,
  isMobileBePartOfItSubmittedAtom,
  isMobileCharacterRelationShowAtom,
} from '@/atoms/character-relation';
import Background from '@/components/common/Background';
import { FloatingPortal } from '@floating-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mobileCurrentPageIndexAtom } from '@/atoms/nav';
import { SPECTRUM_PAGE_INDEX } from '@/constants/config';
import gsap from 'gsap';
import BePartOfIt from '../BePartOfIt';
import CharacterRelationGraph from '../CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';
import CharacterRelationLegend from '../CharacterRelationLegend';

const MobileCharacterRelation = () => {
  const mobileCurrentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const isMobileCharacterRelationShow = useAtomValue(isMobileCharacterRelationShowAtom);
  const [isBePartOfItShow, setIsBePartOfItShow] = useAtom(isMobileBePartOfItShowAtom);
  const isMobileBePartOfItSubmitted = useAtomValue(isMobileBePartOfItSubmittedAtom);

  const bePartOfItTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useFetchCharacterRelation();

  // clipPath animation state
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

  const resetBePartOfItTimer = useCallback(() => {
    if (bePartOfItTimerRef.current) {
      clearTimeout(bePartOfItTimerRef.current);
      bePartOfItTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mobileCurrentPageIndex !== SPECTRUM_PAGE_INDEX) return;

    if (isMobileCharacterRelationShow) {
      refetch();

      // Set opening clipPath animation
      setClipPathValue(createClipPath(true));
      gsap.set('.base-background2', { opacity: 100, delay: 0.5 });

      if (!isMobileBePartOfItSubmitted) {
        // show BePartOfIt after 3 seconds when character relation is shown
        bePartOfItTimerRef.current = setTimeout(() => {
          setIsBePartOfItShow(true);
        }, 3000);
      } else {
        resetBePartOfItTimer();
      }
    } else {
      // Set closing clipPath animation
      setClipPathValue(createClipPath(false));
      gsap.set('.base-background2', { opacity: 0 });
      resetBePartOfItTimer();
      setIsBePartOfItShow(false);
    }

    return () => {
      resetBePartOfItTimer();
    };
  }, [
    isMobileCharacterRelationShow,
    mobileCurrentPageIndex,
    isMobileBePartOfItSubmitted,
    createClipPath,
    setIsBePartOfItShow,
    resetBePartOfItTimer,
    refetch,
  ]);

  const handleBePartOfItClose = useCallback(() => {
    if (isBePartOfItShow) {
      setIsBePartOfItShow(false);
    }
  }, [isBePartOfItShow, setIsBePartOfItShow]);

  useEffect(() => {
    if (bePartOfItRef.current) {
      if (isBePartOfItShow) {
        bePartOfItTimelineRef.current.clear();
        gsap.set(bePartOfItRef.current, { bottom: '-100%' });
        bePartOfItTimelineRef.current.to(bePartOfItRef.current, { bottom: '6rem' });
        bePartOfItTimelineRef.current.play(0);
      } else {
        bePartOfItTimelineRef.current.reverse();
      }
    }
  }, [isBePartOfItShow, bePartOfItRef]);

  return (
    <FloatingPortal key="mobile-character-relation-portal">
      <AnimatePresence>
        <motion.div
          key="mobile-character-relation-motion-wrapper"
          animate={isMobileCharacterRelationShow ? 'open' : 'close'}
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
          <div className="h-full w-full pb-17 pt-15">
            {isMobileCharacterRelationShow && data && <CharacterRelationGraph data={data} />}
          </div>
          <CharacterRelationLegend />
        </motion.div>
        {isMobileCharacterRelationShow && (
          <BePartOfIt
            key="mobile-be-part-of-it-comp"
            ref={bePartOfItRef}
            onCountdownEnd={handleBePartOfItClose}
            onClose={handleBePartOfItClose}
          />
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

export default MobileCharacterRelation;
