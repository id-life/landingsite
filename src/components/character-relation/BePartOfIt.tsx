'use client';

import { FormEvent, forwardRef, memo, useEffect, useRef, useState } from 'react';
import BePartOfItInput from './BePartOfItInput';
import { CharacterRelation, CharacterRelationData, CharacterRelationImpression } from '@/apis/types';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMutationCharacterRelation } from '@/hooks/useMutationCharacterRelation';

const CHARACTER_RELATION_PLAIN_DATA: CharacterRelation = { character: '', impression: CHARACTER_RELATION_IMPRESSION.GOOD };

interface BePartOfItProps {
  onCountdownEnd?: () => void;
}

const BePartOfIt = forwardRef<HTMLDivElement, BePartOfItProps>((props, ref) => {
  const { onCountdownEnd } = props;

  const isMobile = useIsMobile();

  const [character, setCharacter] = useState<CharacterRelationData['character']>('');
  const [relation, setRelation] = useState<CharacterRelationData['relation']>([CHARACTER_RELATION_PLAIN_DATA]);

  const isSubmittingRef = useRef(false);

  const submittedMsgRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(5);

  const {
    mutateAsync: addCharacterRelationData,
    isPending: isMutationPending,
    isSuccess: isMutationSuccess,
  } = useMutationCharacterRelation();

  const handleRelationCharacterChange = (value: string, index: number) => {
    setRelation((prev) => {
      const newRelation = [...prev];
      newRelation[index] = { ...newRelation[index], character: value };
      return newRelation;
    });
  };

  const handleRelationImpressionChange = (impression: CharacterRelationImpression, index: number) => {
    setRelation((prev) => {
      const newRelation = [...prev];
      newRelation[index] = { ...newRelation[index], impression };
      return newRelation;
    });
  };

  const handleAddRelation = (index: number) => {
    if (isSubmittingRef.current) return;
    if (relation.length < 3 && !!relation[index].character && index + 1 < 3 && !relation[index + 1]) {
      setRelation((prev) => [...prev, CHARACTER_RELATION_PLAIN_DATA]);
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMutationPending || isMutationSuccess) return;

    const relationData: CharacterRelationData = {
      character,
      relation: relation.filter((rel) => !!rel.character),
    };

    addCharacterRelationData(relationData);
  };

  useEffect(() => {
    if (isMutationSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (isMutationSuccess && countdown === 0) {
      onCountdownEnd?.();
    }
  }, [countdown, isMutationSuccess, onCountdownEnd]);

  useEffect(() => {
    if (isMutationSuccess) {
      if (isMobile) {
        gsap.to(submittedMsgRef.current, {
          bottom: '-1.25rem',
          translateY: '100%',
          opacity: 1,
          zIndex: 102,
        });
      } else {
        gsap.to(submittedMsgRef.current, {
          top: '2.5rem',
        });
      }
    }
  }, [isMutationSuccess, isMobile]);

  return (
    <div
      ref={ref}
      className={cn(
        isMobile ? '' : 'be-part-of-it-clip',
        'fixed -bottom-[16.5rem] left-1/2 z-[51] translate-x-[-50%] border-2 border-solid border-white bg-white/40 p-10 pt-9 backdrop-blur',
        '-bottom-full mobile:w-full mobile:p-8 mobile:py-5',
      )}
    >
      <div className="font-oxanium text-3xl font-bold tracking-normal">BE PART OF IT</div>
      <div
        ref={submittedMsgRef}
        className={cn(
          'fixed -top-17 z-[102] w-max rounded-full bg-[#148D02] px-5 py-1 text-center font-poppins text-xs/5 font-semibold tracking-normal text-white',
          !isMobile && relation.length > 1 ? 'left-1/2 -translate-x-1/2' : 'right-10',
          'mobile:bottom-0 mobile:left-1/2 mobile:top-auto mobile:-z-10 mobile:min-w-[19.4375rem] mobile:max-w-[calc(100%-4rem)] mobile:-translate-x-1/2 mobile:opacity-0',
        )}
      >
        You will be part of the network soon! After we examine your information (
        <span className="inline-block min-w-2.5 text-center">{countdown}</span>
        S)
      </div>
      <form className="mt-6 flex w-full flex-col items-end mobile:mt-4" onSubmit={onFormSubmit}>
        <div className={cn('flex w-full gap-x-6', 'mobile:flex mobile:flex-col')}>
          <BePartOfItInput
            key="visitor-input"
            mode="visitor"
            placeholder="Enter your name"
            value={character}
            required
            disabled={isMutationPending || isMutationSuccess}
            onChange={(e) => setCharacter(e.target.value)}
          />
          {relation.map((rel, i) => (
            <BePartOfItInput
              key={`introducer-input-${i}`}
              mode="introducer"
              placeholder={i === 0 ? 'Who inspired you?' : 'Anyone else? If not, just press confirm.'}
              required={i === 0}
              disabled={isMutationPending || isMutationSuccess}
              value={rel.character}
              impression={rel.impression}
              onBlur={() => handleAddRelation(i)}
              onChange={(e) => handleRelationCharacterChange(e.target.value, i)}
              onImpressionChange={(impression) => handleRelationImpressionChange(impression, i)}
            />
          ))}
        </div>

        <div
          className={cn(
            'footer-submit-clip relative mt-1.5 w-[10.5rem] bg-red-600 text-white mobile:w-[5.625rem]',
            'mobile:w-full',
          )}
          onPointerDown={() => (isSubmittingRef.current = true)}
          onPointerUp={() => (isSubmittingRef.current = false)}
        >
          {isMutationPending ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-red-600">
              <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
            </div>
          ) : null}
          {isMutationSuccess ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-red-600 font-bold">
              <CheckedSVG className="w-6 stroke-white stroke-[3]" /> Success
            </div>
          ) : null}
          <input
            className="w-full cursor-pointer py-3 text-base/5 font-bold mobile:font-semibold"
            type="submit"
            value="Confirm"
          />
        </div>
      </form>
    </div>
  );
});

BePartOfIt.displayName = 'BePartOfIt';

export default memo(BePartOfIt);
