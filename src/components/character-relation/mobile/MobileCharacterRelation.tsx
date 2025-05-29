'use client';

import { isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';
import Background from '@/components/common/Background';
import { FloatingPortal } from '@floating-ui/react';
import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mobileCurrentPageIndexAtom } from '@/atoms/nav';
import { SPECTRUM_PAGE_INDEX } from '@/constants/config';
import gsap from 'gsap';
import BePartOfIt from '../BePartOfIt';
import CharacterRelationGraph from '../CharacterRelationGraph';
import { useFetchCharacterRelation } from '@/hooks/useFetchCharacterRelation';

const MobileCharacterRelation = () => {
  const mobileCurrentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const isMobileCharacterRelationShow = useAtomValue(isMobileCharacterRelationShowAtom);

  const bePartOfItTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bePartOfItTimelineRef = useRef(gsap.timeline({ paused: true }));
  const bePartOfItRef = useRef<HTMLDivElement>(null);
  const [isBePartOfItShow, setIsBePartOfItShow] = useState(false);

  const { data } = useFetchCharacterRelation();

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

  useEffect(() => {
    if (mobileCurrentPageIndex !== SPECTRUM_PAGE_INDEX) return;

    if (isMobileCharacterRelationShow) {
      // Set opening clipPath animation
      setClipPathValue(createClipPath(true));

      // show BePartOfIt after 3 seconds when character relation is shown
      bePartOfItTimerRef.current = setTimeout(() => {
        setIsBePartOfItShow(true);
      }, 3000);
      gsap.set('.base-background2', { opacity: 100, delay: 0.5 });
    } else {
      // Set closing clipPath animation
      setClipPathValue(createClipPath(false));

      gsap.set('.base-background2', { opacity: 0 });
      resetBePartOfItState();
    }

    return () => {
      resetBePartOfItState();
    };
  }, [isMobileCharacterRelationShow, mobileCurrentPageIndex, createClipPath]);

  function resetBePartOfItState() {
    if (bePartOfItTimerRef.current) {
      clearTimeout(bePartOfItTimerRef.current);
      bePartOfItTimerRef.current = null;
    }
    setIsBePartOfItShow(false);
  }

  const handleCountdownEnd = useCallback(() => {
    if (!bePartOfItTimelineRef.current.reversed()) {
      bePartOfItTimelineRef.current.reverse();
    }
  }, []);

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
              zIndex: -1,
              opacity: 0,
              clipPath: clipPathValue,
              top: 0,
            },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeIn',
          }}
          className="character-relation-css-vars-inject fixed -top-full left-0 h-full w-full"
        >
          <Background />
          <CharacterRelationGraph data={data} />
        </motion.div>
        {isBePartOfItShow && (
          <BePartOfIt key="mobile-be-part-of-it-comp" ref={bePartOfItRef} onCountdownEnd={handleCountdownEnd} />
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

export default MobileCharacterRelation;
