import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import { currentPageAtom, currentPageIndexAtom, navigateToAtom } from '@/atoms';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function PageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(currentPageAtom);
  return (
    <div className={cn('flex-center pointer-events-auto z-10 cursor-pointer gap-3', className)}>
      <ArrowItem isUp />
      {currentPage.id !== NAV_LIST[2].id && <ArrowItem />}
    </div>
  );
}

function ArrowItem({ isUp, onClick }: { isUp?: boolean; onClick?: () => void }) {
  const currentPage = useAtomValue(currentPageAtom);
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        currentPage.id === NAV_LIST[1].id ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={() => {
        onClick?.();
        setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
      }}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
