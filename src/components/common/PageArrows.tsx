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
import { hasBlackArrow, hasInnerPage, NAV_LIST } from '../nav/nav';
import { useConnectShowEvent } from '@/hooks/connectGL/useConnectShowEvent';

interface PageArrowsProps {
  className?: string;
}

export default function PageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(currentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);

  const getTotal = useCallback(() => {
    if (!hasInnerPage(currentPage.id)) return 0;
    // PC版这些页面没有内页切换，返回0让箭头直接导航到下一页
    if (currentPage.id === 'insights_page' || currentPage.id === 'portfolio_page' || currentPage.id === 'spectrum_page') {
      return 0;
    }
    return 0; // 目前所有页面都不使用内页切换
  }, [currentPage]);

  // 更新 innerPageTotal
  useEffect(() => {
    const total = getTotal();
    if (innerPageTotal !== total) {
      setInnerPageTotal(total);
    }
  }, [getTotal, setInnerPageTotal, innerPageTotal]);

  const isConnectPage = useMemo(() => {
    // Connect页面不展示向下箭头
    return currentPage.id === 'connect_page';
  }, [currentPage.id]);

  return (
    <div className={cn('pointer-events-auto z-20 flex flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isConnectPage && <ArrowItem />}
      </div>
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
  const { sendValueShowEvent } = useConnectShowEvent();

  const throttleTime = useMemo(() => {
    if (currentPage.id === 'connect_page') return 2000;
    return 500;
  }, [currentPage]);

  const handleClick = useThrottle(() => {
    onClick?.();
    if (hasInnerPage(currentPage.id) && innerPageTotal > 0) {
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
      sendValueShowEvent(innerPageIndex + (isUp ? -1 : 1), 'click');
      return;
    }
    setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
  }, throttleTime);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        hasBlackArrow(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
