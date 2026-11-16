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
import { isBePartOfItShowAtom, isBePartOfItSubmittedAtom } from '@/atoms/character-relation';
import { trackOutbound } from '@/lib/analytics/outbound';
import { track } from '@/lib/analytics/track';
import HoneypotField from '@/components/forms/HoneypotField';
import { Form, FormSubmitHandler, useForm } from 'react-hook-form';
import { u } from '@/utils/layout-unit';

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
  /** Honeypot (ENG-09): people never fill it; a filled one means a bot, and nothing is sent. */
  website?: string;
  [key: `introducer_${number}`]: string;
}

const REQUIRED_ERROR_MESSAGE = 'Please enter name';
/** Names are trimmed and capped before they are sent (the API also feeds a public graph). */
const MAX_NAME_LENGTH = 80;
const cleanName = (name: string) => name.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH);

const BePartOfIt = forwardRef<HTMLDivElement, BePartOfItProps>((props, ref) => {
  const { onCountdownEnd, onClose } = props;

  const isMobile = useIsMobile();
  const isBePartOfItShow = useAtomValue(isBePartOfItShowAtom);
  const setIsBePartOfItSubmitted = useSetAtom(isBePartOfItSubmittedAtom);

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

  const onFormSubmit: FormSubmitHandler<BePartOfItFormValues> = ({ data, event }) => {
    event?.preventDefault();
    if (isMutationPending || isMutationSuccess) return;
    if (data.website) return;

    const relationData: CharacterRelationData = {
      character: cleanName(character),
      relation: relation.map((rel) => ({ ...rel, character: cleanName(rel.character) })).filter((rel) => !!rel.character),
    };
    if (!relationData.character) return;

    addCharacterRelationData(relationData, {
      // DATA-03: counted only once the API accepted it (it used to fire on every attempt).
      onSuccess: () => track('relation_submit'),
      onSettled: () => (isSubmittingRef.current = false),
    });
  };

  const handleLinkClick = () => {
    trackOutbound('https://agingbiotech.info/people/', 'outbound_click', {
      link_type: 'other',
      item_id: 'agingbiotech_people',
      placement: 'influence_network',
    });
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
      setIsBePartOfItSubmitted(true);
      onCountdownEnd?.();
    }
  }, [countdown, isMobile, isMutationSuccess, onCountdownEnd, setIsBePartOfItSubmitted]);

  useEffect(() => {
    if (isMutationSuccess) {
      submittedMsgTimelineRef.current.clear();
      if (isMobile) {
        submittedMsgTimelineRef.current.to(submittedMsgRef.current, {
          bottom: u(4.875),
          translateY: '100%',
          opacity: 1,
          zIndex: 30,
        });
      } else {
        submittedMsgTimelineRef.current.to(submittedMsgRef.current, {
          top: u(2.5),
          opacity: 1,
        });
      }
      submittedMsgTimelineRef.current.play(0);
    }
  }, [isMutationSuccess, isMobile]);

  useEffect(() => {
    if (isBePartOfItShow) return;

    setTimeout(() => {
      form.reset();
      form.clearErrors();
      setCharacter('');
      setRelation([CHARACTER_RELATION_PLAIN_DATA]);
      setCountdown(5);
      submittedMsgTimelineRef.current.revert();
      resetMutation();
    }, 500);
  }, [isBePartOfItShow, form, resetMutation]);

  return (
    <div
      ref={ref}
      className={cn(
        isMobile ? '' : 'be-part-of-it-clip',
        'fixed -bottom-[16.5rem] left-1/2 z-[20] translate-x-[-50%] border-2 border-solid border-white bg-white/40 p-10 pt-9 backdrop-blur',
        // Never wider than the window; on a medium window it takes the width right of the legend.
        '-bottom-full max-w-[calc(100vw_-_2rem)] mobile:w-full mobile:max-w-none mobile:p-8 mobile:py-5',
        // Below 1440 px on the desktop tree (a fixed 12 px layout unit) the panel sits beside the legend at the bottom
        // right, so both show with the form open and it covers no more of the graph than it must.
        '[@media(min-width:600px)_and_(min-height:480px)_and_(max-width:1439.98px)]:left-auto [@media(min-width:600px)_and_(min-height:480px)_and_(max-width:1439.98px)]:right-3 [@media(min-width:600px)_and_(min-height:480px)_and_(max-width:1439.98px)]:translate-x-0',
        'medium:w-[calc(100vw_-_252px)] medium:p-6',
        // A phone in landscape: the original's laptop arrangement (one row of inputs, Confirm beside the note), a
        // panel to the right of the legend and clear of the header, not the portrait phone's full-screen stack.
        'shortScreen:left-auto shortScreen:right-4 shortScreen:w-[44rem] shortScreen:max-w-[calc(100vw_-_2rem)] shortScreen:translate-x-0 shortScreen:p-5 shortScreen:pt-4',
        isMobile && isMutationSuccess && 'mobile:z-[30]',
      )}
    >
      {/* Type roles (RWD-01), each the role that fits the original panel's boxes: heading title-sm, inputs body (16 px,
          so iOS does not zoom on focus), the source note and the success message caption. */}
      <div className="font-display text-title-sm font-bold tracking-normal mobile:text-title shortScreen:text-title-sm">
        BE PART OF IT
      </div>

      {/* submit msg */}
      <div
        ref={submittedMsgRef}
        className={cn(
          'fixed -top-17 left-1/2 z-[30] w-max -translate-x-1/2 rounded-full bg-data-leaf px-5 py-1 text-center font-text text-caption font-semibold tracking-normal text-white opacity-0',
          'mobile:bottom-0 mobile:left-1/2 mobile:top-auto mobile:-z-10 mobile:min-w-[19.4375rem] mobile:max-w-[calc(100%-4rem)] mobile:-translate-x-1/2',
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
        // A 44 px box on a touch screen (RWD-06).
        className={cn(
          'absolute right-6 top-6 flex cursor-pointer items-center justify-center fill-black tap',
          isMutationPending && 'cursor-not-allowed',
        )}
        onClick={handleClose}
        onPointerDown={() => (isSubmittingRef.current = true)}
      >
        <CloseSVG className="size-5" />
      </div>

      <Form
        control={form.control}
        className="relative mt-6 flex w-full flex-col items-end mobile:mt-4 shortScreen:mt-3"
        onSubmit={onFormSubmit}
      >
        <HoneypotField {...form.register('website')} />
        {/* Medium windows (600-839 px): the two inputs share the panel's width instead of keeping 409 px each, which
            pushed the second one out of the window at 820 px. */}
        <div
          className={cn(
            'flex w-full gap-x-[4.75rem]',
            'mobile:flex-col medium:gap-x-6 shortScreen:flex-row shortScreen:gap-x-4',
          )}
        >
          <BePartOfItInput
            key="visitor-input"
            mode="visitor"
            placeholder="Enter your name"
            value={character}
            disabled={isMutationPending || isMutationSuccess}
            wrapperClassName={cn('medium:min-w-0 medium:flex-1', form.formState.errors.visitor && 'mobile:mt-5')}
            error={form.formState.errors.visitor}
            {...form.register('visitor', {
              required: REQUIRED_ERROR_MESSAGE,
              onChange: (e) => setCharacter(e.target.value),
            })}
          />
          <div className={cn('flex items-center gap-x-6', 'mobile:flex-col medium:min-w-0 medium:flex-1 shortScreen:flex-row')}>
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

        <div
          className={cn('flex w-full items-center justify-between gap-x-10', 'mobile:flex-col-reverse shortScreen:flex-row')}
        >
          <div className="font-text text-caption font-medium leading-snug tracking-normal text-ink-muted mobile:mt-3">
            This page is a derived work from{' '}
            <a
              href="https://agingbiotech.info/people/"
              target="_blank"
              onClick={handleLinkClick}
              className={cn(
                // Inline in the sentence, as the original; the hit area grows to 44 px on touch screens through
                // ::before (RWD-06), so the line spacing stays the original's.
                'relative text-accent tap-area',
                'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition after:duration-300 hover:after:scale-x-100',
              )}
            >
              https://agingbiotech.info/people/
            </a>
            . For more comprehensive information, please visit the original website.
          </div>

          <div
            className={cn(
              'footer-submit-clip relative mt-1.5 w-[10.5rem] flex-shrink-0 bg-accent text-white mobile:w-[5.625rem]',
              'mobile:mt-3.5 mobile:w-full shortScreen:mt-1.5 shortScreen:w-[10.5rem]',
            )}
            onPointerDown={() => (isSubmittingRef.current = true)}
          >
            {isMutationPending ? (
              <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-accent">
                <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
              </div>
            ) : null}
            {isMutationSuccess ? (
              <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-accent font-bold">
                <CheckedSVG className="w-6 stroke-white stroke-[3]" /> Success
              </div>
            ) : null}
            <input
              className="w-full cursor-pointer py-3 text-body font-bold leading-5 mobile:font-semibold"
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
