import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  mobileIsScrollingAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useEffect } from 'react';
import { BLACK_ARROW_LIST, HAS_INNER_PAGE_LIST, NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);

  // 更新 innerPageTotal (Portfolio/Spectrum 由各自组件动态设置)
  useEffect(() => {
    if (!HAS_INNER_PAGE_LIST.includes(currentPage.id)) {
      setInnerPageTotal(0);
      return;
    }
    // Portfolio 和 Spectrum 由各自组件动态设置 innerPageTotal
    if (currentPage.id === NAV_LIST[1].id || currentPage.id === NAV_LIST[2].id) return;
    // Insights 使用固定值
    if (currentPage.id === NAV_LIST[5].id) {
      setInnerPageTotal(2); // Insights 页有 2 个内部页面 (News & Talks, Podcast)
    }
  }, [currentPage, setInnerPageTotal]);

  const isConnectPage = useMemo(() => {
    // Connect页面不展示向下箭头
    return currentPage.id === NAV_LIST[6].id;
  }, [currentPage.id]);

  return (
    <div className={cn('pointer-events-auto z-40 flex cursor-pointer flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isConnectPage && <ArrowItem />}
      </div>
    </div>
  );
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);

  const handleClick = useThrottle(() => {
    if (mobileIsScrolling) return;
    if (HAS_INNER_PAGE_LIST.includes(currentPage.id)) {
      // 有内页翻页
      if (innerPageIndex === 0 && isUp) {
        // 第一个内页往上翻 -> 跳到上一个主页面
        mobileNavChange(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 最后一个内页往下翻 -> 跳到下一个主页面
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
        BLACK_ARROW_LIST.includes(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
