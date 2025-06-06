import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  currentPageAtom,
  currentPageIndexAtom,
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  navigateToAtom,
} from '@/atoms';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { BLACK_ARROW_LIST, HAS_INNER_PAGE_LIST, NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function PageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(currentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);
  // const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);

  const getTotal = useCallback(() => {
    if (!HAS_INNER_PAGE_LIST.includes(currentPage.id)) return 0;
    return 5; // 目前就一个 Value 页有
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

  return (
    <div className={cn('pointer-events-auto z-20 flex flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isLastPageAndInnerPage && <ArrowItem />}
      </div>
      {/* 细长方块进度条 */}
      {/* {pageIndexList?.length ? (
        <div className="flex-center order-2 gap-3 mobile:order-1">
          {pageIndexList.map((_, index) => (
            <div
              key={`inner-page-index-${index}`}
              className={cn(
                'relative h-1 w-15 rounded-full mobile:h-0.5 mobile:w-6',
                BLACK_ARROW_LIST.includes(currentPage.id)
                  ? innerPageIndex !== index
                    ? 'bg-white/20'
                    : 'bg-white/40'
                  : innerPageIndex === index
                    ? 'bg-gray-800'
                    : 'bg-[#B8B8B8]',
              )}
            >
              <div className="pointer-events-auto absolute inset-x-0 -bottom-2 z-20 h-4 w-full" />
            </div>
          ))}
        </div>
      ) : null} */}
    </div>
  );
}

function ArrowItem({ isUp, onClick }: { isUp?: boolean; onClick?: () => void }) {
  const currentPage = useAtomValue(currentPageAtom);
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);

  const handleClick = useThrottle(() => {
    console.log('click', { innerPageIndex, innerPageTotal, isUp, currentPageIndex });
    onClick?.();
    if (HAS_INNER_PAGE_LIST.includes(currentPage.id)) {
      // 有小进度条
      if (innerPageIndex === 0 && isUp) {
        // 小进度开头 往上翻
        setNavigateTo(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 最后一个小进度 往下翻
        setNavigateTo(NAV_LIST[currentPageIndex + 1]);
        return;
      }
      setInnerPageNavigateTo(innerPageIndex + (isUp ? -1 : 1));
      return;
    }
    setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
  }, 1000);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        BLACK_ARROW_LIST.includes(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
