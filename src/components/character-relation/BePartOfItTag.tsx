import { CharacterRelationImpression } from '@/apis/types';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';
import { cn } from '@/utils';
import React, { HTMLAttributes, memo } from 'react';

interface BePartOfItTagProps {
  className?: string;
  impression: CharacterRelationImpression;
  isActive?: boolean;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
}

const BePartOfItTag = (props: BePartOfItTagProps) => {
  const { className, impression, isActive = false, onClick } = props;

  const isGood = impression === CHARACTER_RELATION_IMPRESSION.GOOD;

  return (
    <div
      className={cn(
        'h-5 w-[3.3125rem] cursor-pointer border text-center font-poppins text-xs/5 font-semibold tracking-normal',
        isActive
          ? 'be-part-of-it-tag-active-clip border-red-600 bg-red-600 text-white'
          : 'be-part-of-it-tag-inactive-clip border-gray-800',
        className,
      )}
      onClick={onClick}
    >
      {isGood ? CHARACTER_RELATION_IMPRESSION.GOOD : CHARACTER_RELATION_IMPRESSION.MIXED}
    </div>
  );
};

export default memo(BePartOfItTag);
