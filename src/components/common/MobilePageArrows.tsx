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
import { hasBlackArrow, hasInnerPage, NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);

  // 更新 innerPageTotal (Portfolio/Spectrum 由各自组件动态设置)
  useEffect(() => {
    if (!hasInnerPage(currentPage.id)) {
      setInnerPageTotal(0);
      return;
    }
    // Portfolio 和 Spectrum 由各自组件动态设置 innerPageTotal
    if (currentPage.id === 'portfolio_page' || currentPage.id === 'spectrum_page') return;
    // Insights 使用固定值 - 现在只有 1 个页面（News & Talks 和 Podcast 同时显示）
    if (currentPage.id === 'insights_page') {
      setInnerPageTotal(1);
    }
  }, [currentPage, setInnerPageTotal]);

  const isConnectPage = useMemo(() => {
    // Connect页面不展示向下箭头
    return currentPage.id === 'connect_page';
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

/**
 * One step through the phone experience: the next / previous inner page of Portfolio, Insights and
 * Spectrum, then the next / previous section. Shared by the arrow buttons and the swipe gesture.
 */
export function useMobileSectionStep() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);

  return useThrottle((isUp: boolean) => {
    if (mobileIsScrolling) return;
    if (hasInnerPage(currentPage.id)) {
      // 有内页翻页
      if (innerPageIndex === 0 && isUp) {
        // 第一个内页往上翻 -> 跳到上一个主页面
        if (currentPageIndex > 0) mobileNavChange(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 最后一个内页往下翻 -> 跳到下一个主页面
        if (currentPageIndex < NAV_LIST.length - 1) mobileNavChange(NAV_LIST[currentPageIndex + 1]);
        return;
      }
      setInnerPageNavigateTo(innerPageIndex + (isUp ? -1 : 1));
      return;
    }
    const target = NAV_LIST[currentPageIndex + (isUp ? -1 : 1)];
    if (target) mobileNavChange(target);
  }, 700);
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const step = useMobileSectionStep();

  return (
    <button
      type="button"
      aria-label={isUp ? 'Previous section' : 'Next section'}
      className={cn(
        // 40 px circle with a 48 px touch target (the ::before pseudo-element extends the hit area).
        'flex-center relative h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm before:absolute before:-inset-1 before:content-[""]',
        hasBlackArrow(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={() => step(Boolean(isUp))}
    >
      <ArrowDownSVG aria-hidden="true" className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </button>
  );
}
