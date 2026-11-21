import { CharacterRelationImpression } from '@/apis/types';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import { cn } from '@/utils';
import React, { HTMLAttributes, memo } from 'react';

interface BePartOfItTagProps {
  className?: string;
  impression: CharacterRelationImpression;
  isActive?: boolean;
  onClick?: HTMLAttributes<HTMLButtonElement>['onClick'];
}

const BePartOfItTag = (props: BePartOfItTagProps) => {
  const { className, impression, isActive = false, onClick } = props;

  const isGood = impression === CHARACTER_RELATION_IMPRESSION.GOOD;

  const classes = cn(
    'h-5 w-[3.3125rem] cursor-pointer border text-center font-text text-xs/5 font-semibold tracking-normal',
    isActive
      ? 'be-part-of-it-tag-active-clip border-accent bg-accent text-white'
      : 'be-part-of-it-tag-inactive-clip border-tone-800',
    className,
  );
  const label = isGood ? CHARACTER_RELATION_IMPRESSION.GOOD : CHARACTER_RELATION_IMPRESSION.MIXED;

  // A tag that can be pressed is one of the two answers to "First Impression?": a button that says whether it is the
  // chosen one, drawn as the div was (block: a button is otherwise inline-block). The tag shown beside a filled name
  // only displays the answer, so it stays a plain element.
  return onClick ? (
    <button type="button" aria-pressed={isActive} className={cn('block', classes)} onClick={onClick}>
      {label}
    </button>
  ) : (
    <div className={classes}>{label}</div>
  );
};

export default memo(BePartOfItTag);
