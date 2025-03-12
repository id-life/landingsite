import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  navigateToAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}
export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const pageIndexList = useMemo(() => {
    if (currentPage.id === NAV_LIST[2].id) return new Array(4).fill(0);
    if (currentPage.id === NAV_LIST[4].id) return new Array(5).fill(0);
    return [];
  }, [currentPage]);
  return (
    <div className={cn('pointer-events-auto z-10 flex cursor-pointer flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {(currentPage.id !== NAV_LIST[2].id || innerPageIndex !== 5) && <ArrowItem />}
      </div>
      {/* value 页面 5个细长方块进度条 */}
      {pageIndexList?.length ? (
        <div className="flex-center order-2 gap-3 mobile:order-1">
          {pageIndexList.map((_, index) => (
            <div
              key={`value-page-index-${index}`}
              className={cn(
                'h-1 w-15 rounded-full mobile:h-0.5 mobile:w-6',
                innerPageIndex === index ? 'bg-gray-800' : 'bg-[#B8B8B8]',
              )}
            ></div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setValuePageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();

  const handleClick = useThrottle(() => {
    if (innerPageIndex !== -1) {
      // 有小进度条
      // 第三页 ValueGL
      if (innerPageIndex === 0 && isUp) {
        // 小进度开头 往上翻
        mobileNavChange(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 小进度结尾 往下翻
        mobileNavChange(NAV_LIST[currentPageIndex + 1]);
        return;
      }
      setValuePageNavigateTo(innerPageIndex + (isUp ? -1 : 1));
    } else mobileNavChange(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
    setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
  }, 1000);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        currentPage.id === NAV_LIST[1].id ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
