'use client';

import { cn } from '@/utils';
import { forwardRef, InputHTMLAttributes, memo, useImperativeHandle, useRef, useState } from 'react';
import { IndividualType } from './CharacterRelation';
import BePartOfItTag from './BePartOfItTag';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import { CharacterRelationImpression } from '@/apis/types';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { FieldError } from 'react-hook-form';

interface BePartOfItInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  mode?: Exclude<IndividualType, 'all'>;
  tagPlaceholderHeight?: string;
  impression?: CharacterRelationImpression;
  error?: FieldError;
  onImpressionChange?: (impression: CharacterRelationImpression) => void;
}

const BePartOfItInput = forwardRef<HTMLInputElement, BePartOfItInputProps>((props, ref) => {
  const {
    type = 'text',
    className,
    maxLength = 20,
    value = '',
    autoComplete = 'off',
    mode = 'visitor',
    tagPlaceholderHeight = 'h-7.5',
    impression,
    error,
    onBlur,
    onFocus,
    onImpressionChange,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!, [inputRef]);

  const [isFocused, setIsFocused] = useState(false);
  const { trackEvent } = useGA();

  const isIntroducer = mode === 'introducer';

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
    trackEvent({ name: GA_EVENT_NAMES.IN_INPUT });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const isTagActive = impression !== CHARACTER_RELATION_IMPRESSION.MIXED;

  return (
    <div className="w-full">
      <label className="relative block">
        <input
          type={type}
          ref={inputRef}
          className={cn(
            'h-11 w-[25.5625rem] border-[1.5px] border-solid border-black bg-transparent p-3 pr-14 font-poppins text-xs/5 font-semibold tracking-normal',
            'disabled:cursor-not-allowed data-[error=true]:border-red-600',
            'mobile:w-full',
            className,
          )}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-error={!!error}
          {...rest}
        />
        {isIntroducer && impression && !isFocused && !!value && (
          <BePartOfItTag
            className="absolute right-[3.25rem] top-1/2 -translate-y-1/2 cursor-default"
            impression={impression}
            isActive
          />
        )}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-text select-none font-poppins text-xs/5 font-semibold tracking-normal">
          {value.length}/{maxLength}
        </span>
      </label>
      {!isIntroducer || (isIntroducer && !isFocused) ? (
        <div className={cn('relative w-full text-right', 'mobile:text-left', tagPlaceholderHeight, !!error && 'mobile:h-10')}>
          {error && (
            <span
              className={cn(
                'font-poppins text-xs/3 font-semibold tracking-normal text-red-600',
                'absolute bottom-1 right-0',
                'mobile:bottom-4 mobile:left-0 mobile:pl-3',
              )}
            >
              {error.message}
            </span>
          )}
        </div>
      ) : (
        <div
          onPointerDown={(e) => e.preventDefault()}
          className={cn(
            'flex items-center justify-between pl-3 pt-2.5',
            'mobile:mb-4 mobile:flex-col mobile:items-start mobile:justify-start',
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-poppins text-xs/5 font-semibold tracking-normal">First Impression?</span>
            <BePartOfItTag
              impression={CHARACTER_RELATION_IMPRESSION.GOOD}
              isActive={isTagActive}
              onClick={() => onImpressionChange?.(CHARACTER_RELATION_IMPRESSION.GOOD)}
            />
            <BePartOfItTag
              impression={CHARACTER_RELATION_IMPRESSION.MIXED}
              isActive={!isTagActive}
              onClick={() => onImpressionChange?.(CHARACTER_RELATION_IMPRESSION.MIXED)}
            />
          </div>
          {error && (
            <span className={cn('font-poppins text-xs/3 font-semibold tracking-normal text-red-600', 'mobile:mt-2')}>
              {error.message}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

BePartOfItInput.displayName = 'BePartOfItInput';

export default memo(BePartOfItInput);
