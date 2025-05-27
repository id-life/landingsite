import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  mobileIsScrollingAtom,
  navigateToAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useEffect, useCallback } from 'react';
import { BLACK_ARROW_LIST, HAS_INNER_PAGE_LIST, NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);

  const getTotal = useCallback(() => {
    if (!HAS_INNER_PAGE_LIST.includes(currentPage.id)) return 0;
    return 3; // 目前就一个 Value 页有
  }, [currentPage]);

  const pageIndexList = useMemo(() => {
    const total = getTotal();
    if (!total) return [];
    return new Array(total).fill(0);
  }, [getTotal]);

  // 更新 innerPageTotal
  useEffect(() => {
    const total = getTotal();
    if (innerPageTotal !== total) {
      setInnerPageTotal(total);
    }
  }, [getTotal, setInnerPageTotal, innerPageTotal]);

  const isLastPageAndInnerPage = useMemo(() => {
    // 最后一页 & 最后一小进度,不展示向下箭头
    return currentPage.id === NAV_LIST[5].id && innerPageIndex === innerPageTotal - 1;
  }, [currentPage.id, innerPageIndex, innerPageTotal]);

  console.log({ currentPage, innerPageIndex, innerPageTotal });

  return (
    <div className={cn('pointer-events-auto z-40 flex cursor-pointer flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isLastPageAndInnerPage && <ArrowItem />}
      </div>
    </div>
  );
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);

  const handleClick = useThrottle(() => {
    if (mobileIsScrolling) return;
    console.log('click', { innerPageIndex, innerPageTotal, isUp, currentPageIndex });
    if (HAS_INNER_PAGE_LIST.includes(currentPage.id)) {
      // 有小进度条
      if (innerPageIndex === 0 && isUp) {
        // 小进度开头 往上翻
        mobileNavChange(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 最后一个小进度 往下翻
        mobileNavChange(NAV_LIST[currentPageIndex + 1]);
        return;
      }
      setInnerPageNavigateTo(innerPageIndex + (isUp ? -1 : 1));
      return;
    }
    mobileNavChange(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
  }, 1000);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        [NAV_LIST[1].id, NAV_LIST[3].id].includes(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
