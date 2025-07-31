'use client';

import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import BePartOfItInput from './BePartOfItInput';
import { CharacterRelation, CharacterRelationData, CharacterRelationImpression } from '@/apis/types';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMutationCharacterRelation } from '@/hooks/useMutationCharacterRelation';
import CloseSVG from '@/../public/svgs/close-3.svg?component';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  isBePartOfItShowAtom,
  isBePartOfItSubmittedAtom,
  isMobileBePartOfItShowAtom,
  isMobileBePartOfItSubmittedAtom,
} from '@/atoms/character-relation';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { Form, FormSubmitHandler, useForm } from 'react-hook-form';

const CHARACTER_RELATION_PLAIN_DATA: CharacterRelation = {
  character: '',
  impression: CHARACTER_RELATION_IMPRESSION.GOOD,
};

interface BePartOfItProps {
  onCountdownEnd?: () => void;
  onClose?: () => void;
}

interface BePartOfItFormValues {
  visitor: string;
  [key: `introducer_${number}`]: string;
}

const REQUIRED_ERROR_MESSAGE = 'Please fill in this field';

const BePartOfIt = forwardRef<HTMLDivElement, BePartOfItProps>((props, ref) => {
  const { onCountdownEnd, onClose } = props;

  const { trackEvent } = useGA();
  const isMobile = useIsMobile();
  const isBePartOfItShow = useAtomValue(isBePartOfItShowAtom);
  const setIsBePartOfItSubmitted = useSetAtom(isBePartOfItSubmittedAtom);
  const isMobileBePartOfItShow = useAtomValue(isMobileBePartOfItShowAtom);
  const setIsMobileBePartOfItSubmitted = useSetAtom(isMobileBePartOfItSubmittedAtom);

  const [character, setCharacter] = useState<CharacterRelationData['character']>('');
  const [relation, setRelation] = useState<CharacterRelationData['relation']>([CHARACTER_RELATION_PLAIN_DATA]);

  const isSubmittingRef = useRef(false);

  const submittedMsgTimelineRef = useRef(gsap.timeline({ paused: true }));
  const submittedMsgRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(5);

  const form = useForm<BePartOfItFormValues>();

  const {
    mutateAsync: addCharacterRelationData,
    isPending: isMutationPending,
    isSuccess: isMutationSuccess,
    reset: resetMutation,
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

  const onMutationSuccess = () => {
    if (isMobile) {
      setIsMobileBePartOfItSubmitted(true);
    } else {
      setIsBePartOfItSubmitted(true);
    }
  };

  const onFormSubmit: FormSubmitHandler<BePartOfItFormValues> = ({ data, event }) => {
    event?.preventDefault();
    if (isMutationPending || isMutationSuccess) return;

    const relationData: CharacterRelationData = {
      character,
      relation: relation.filter((rel) => !!rel.character),
    };

    trackEvent({ name: GA_EVENT_NAMES.IN_SUBMIT });

    addCharacterRelationData(relationData, {
      onSuccess: () => onMutationSuccess(),
      onSettled: () => (isSubmittingRef.current = false),
    });
  };

  const handleLinkClick = () => {
    trackEvent({ name: GA_EVENT_NAMES.IN_LINK });
  };

  const handleClose = () => {
    if (isMutationPending) return;

    onClose?.();
    isSubmittingRef.current = false;
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
      submittedMsgTimelineRef.current.clear();
      if (isMobile) {
        submittedMsgTimelineRef.current.to(submittedMsgRef.current, {
          bottom: '-1.25rem',
          translateY: '100%',
          opacity: 1,
          zIndex: 102,
        });
      } else {
        submittedMsgTimelineRef.current.to(submittedMsgRef.current, {
          top: '2.5rem',
        });
      }
      submittedMsgTimelineRef.current.play(0);
    }
  }, [isMutationSuccess, isMobile]);

  useEffect(() => {
    if (isBePartOfItShow || isMobileBePartOfItShow) return;

    setTimeout(() => {
      setCharacter('');
      setRelation([CHARACTER_RELATION_PLAIN_DATA]);
      setCountdown(5);
      submittedMsgTimelineRef.current.revert();
      form.clearErrors();
      resetMutation();
    }, 500);
  }, [isBePartOfItShow, isMobileBePartOfItShow, form, resetMutation]);

  return (
    <div
      ref={ref}
      className={cn(
        isMobile ? '' : 'be-part-of-it-clip',
        'fixed -bottom-[16.5rem] left-1/2 z-[51] translate-x-[-50%] border-2 border-solid border-white bg-white/40 p-10 pt-9 backdrop-blur',
        '-bottom-full mobile:w-full mobile:p-8 mobile:py-5',
        isMobile && isMutationSuccess && 'mobile:z-[102]',
      )}
    >
      <div className="font-oxanium text-3xl font-bold tracking-normal">BE PART OF IT</div>

      {/* submit msg */}
      <div
        ref={submittedMsgRef}
        className={cn(
          'fixed -top-17 left-1/2 z-[102] w-max -translate-x-1/2 rounded-full bg-[#148D02] px-5 py-1 text-center font-poppins text-xs/5 font-semibold tracking-normal text-white',
          'mobile:bottom-0 mobile:left-1/2 mobile:top-auto mobile:-z-10 mobile:min-w-[19.4375rem] mobile:max-w-[calc(100%-4rem)] mobile:-translate-x-1/2 mobile:opacity-0',
        )}
      >
        <span className="align-middle">
          You’re almost in! We’ll complete your review shortly. (
          <span className="inline-block min-w-2.5 text-center leading-5">{countdown}</span>
          S)
        </span>
      </div>

      {/* close */}
      <div
        className={cn('absolute right-6 top-6 flex cursor-pointer fill-black', isMutationPending && 'cursor-not-allowed')}
        onClick={handleClose}
        onPointerDown={() => (isSubmittingRef.current = true)}
      >
        <CloseSVG />
      </div>

      <Form control={form.control} className="mt-6 flex w-full flex-col items-end mobile:mt-4" onSubmit={onFormSubmit}>
        <div className={cn('flex w-full gap-x-[4.75rem]', 'mobile:flex-col')}>
          <BePartOfItInput
            key="visitor-input"
            mode="visitor"
            placeholder="Enter your name"
            value={character}
            disabled={isMutationPending || isMutationSuccess}
            error={form.formState.errors.visitor}
            {...form.register('visitor', {
              required: REQUIRED_ERROR_MESSAGE,
              onChange: (e) => setCharacter(e.target.value),
            })}
          />
          <div className={cn('flex items-center gap-x-6', 'mobile:flex-col')}>
            {relation.map((rel, i) => (
              <BePartOfItInput
                key={`introducer-input-${i}`}
                mode="introducer"
                placeholder={i === 0 ? 'Who inspired you?' : 'Anyone else? If not, just press confirm.'}
                required={i === 0}
                disabled={isMutationPending || isMutationSuccess}
                value={rel.character}
                impression={rel.impression}
                tagPlaceholderHeight={isMobile ? 'h-4' : 'h-7.5'}
                error={form.formState.errors[`introducer_${i}`]}
                onImpressionChange={(impression) => handleRelationImpressionChange(impression, i)}
                {...form.register(`introducer_${i}`, {
                  required: i === 0 ? REQUIRED_ERROR_MESSAGE : false,
                  onChange: (e) => handleRelationCharacterChange(e.target.value, i),
                  onBlur: () => handleAddRelation(i),
                })}
              />
            ))}
          </div>
        </div>

        <div className={cn('flex w-full items-center justify-between gap-x-10', 'mobile:flex-col-reverse')}>
          <div className="font-poppins text-xs font-medium tracking-normal text-black/50 mobile:mt-3">
            This page is a derived work from{' '}
            <a
              href="https://agingbiotech.info/people/"
              target="_blank"
              onClick={handleLinkClick}
              className={cn(
                'relative text-red-600',
                'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-red-600 after:transition after:duration-300 hover:after:scale-x-100',
              )}
            >
              https://agingbiotech.info/people/
            </a>
            . For more comprehensive information, please visit the original website.
          </div>

          <div
            className={cn(
              'footer-submit-clip relative mt-1.5 w-[10.5rem] flex-shrink-0 bg-red-600 text-white mobile:w-[5.625rem]',
              'mobile:mt-3.5 mobile:w-full',
            )}
            onPointerDown={() => (isSubmittingRef.current = true)}
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
        </div>
      </Form>
    </div>
  );
});

BePartOfIt.displayName = 'BePartOfIt';

export default memo(BePartOfIt);
