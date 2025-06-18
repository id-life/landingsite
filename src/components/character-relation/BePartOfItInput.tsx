'use client';

import { cn } from '@/utils';
import { InputHTMLAttributes, memo, useState } from 'react';
import { IndividualType } from './CharacterRelation';
import BePartOfItTag from './BePartOfItTag';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import { CharacterRelationImpression } from '@/apis/types';

interface BePartOfItInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  mode?: Exclude<IndividualType, 'all'>;
  tagPlaceholderHeight?: string;
  impression?: CharacterRelationImpression;
  onImpressionChange?: (impression: CharacterRelationImpression) => void;
}

const BePartOfItInput = (props: BePartOfItInputProps) => {
  const {
    type = 'text',
    className,
    maxLength = 20,
    value = '',
    autoComplete = 'name',
    mode = 'visitor',
    tagPlaceholderHeight = 'h-7.5',
    impression,
    onBlur,
    onFocus,
    onImpressionChange,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const isIntroducer = mode === 'introducer';

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
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
          className={cn(
            'h-11 w-[25.5625rem] border-[1.5px] border-solid border-black bg-transparent p-3 pr-14 font-poppins text-xs/5 font-semibold tracking-normal disabled:cursor-not-allowed',
            'mobile:w-full',
            className,
          )}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
        <div className={cn('w-full', tagPlaceholderHeight)}></div>
      ) : (
        <div onPointerDown={(e) => e.preventDefault()} className="pl-3 pt-2.5 mobile:mb-4">
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
        </div>
      )}
    </div>
  );
};

export default memo(BePartOfItInput);
