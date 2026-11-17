import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { getSectionState, type SectionSource } from '@/motion/sectionController';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { hasBlackArrow, hasInnerPage, NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}

export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [, setInnerPageTotal] = useAtom(innerPageTotalAtom);

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
    <div className={cn('pointer-events-auto z-40 flex flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isConnectPage && <ArrowItem />}
      </div>
    </div>
  );
}

/** English section name for labels: 'digital twin 孪生' -> 'Digital Twin'. */
function sectionName(title: string) {
  return title
    .replace(/[㐀-鿿]+/g, '')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * What one step in a direction does from the current state: the next / previous inner page of Portfolio,
 * Insights and Spectrum, else the next / previous section. Used to act and to name the arrow buttons.
 */
function resolveStep(
  isUp: boolean,
  state: { pageId: string; pageIndex: number; innerIndex: number; innerTotal: number },
): { kind: 'inner'; index: number } | { kind: 'section'; index: number } | null {
  const { pageId, pageIndex, innerIndex, innerTotal } = state;
  if (hasInnerPage(pageId)) {
    const target = innerIndex + (isUp ? -1 : 1);
    if (target >= 0 && target < innerTotal) return { kind: 'inner', index: target };
  }
  const section = pageIndex + (isUp ? -1 : 1);
  return section >= 0 && section < NAV_LIST.length ? { kind: 'section', index: section } : null;
}

/**
 * Minimum time between two steps; a step asked for sooner is ignored, as on the original. Shared by every arrow
 * and the swipe (module scope): on Connect a tap on the one arrow brings in a second arrow under the finger, and a
 * second quick tap must not be taken by a control that was not there when it began.
 */
const STEP_SPACING_MS = 500;
let lastStepAt = 0;

/** One step through the phone experience, shared by the arrow buttons and the swipe gesture. */
export function useMobileSectionStep() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();

  const stateRef = useRef({
    currentPage,
    currentPageIndex,
    innerPageIndex,
    innerPageTotal,
    mobileNavChange,
    setInnerPageNavigateTo,
  });
  stateRef.current = { currentPage, currentPageIndex, innerPageIndex, innerPageTotal, mobileNavChange, setInnerPageNavigateTo };

  return useCallback((isUp: boolean, source: SectionSource = 'arrow') => {
    const run = (up: boolean) => {
      const s = stateRef.current;
      lastStepAt = performance.now();
      const step = resolveStep(up, {
        pageId: s.currentPage.id,
        pageIndex: s.currentPageIndex,
        innerIndex: s.innerPageIndex,
        innerTotal: s.innerPageTotal,
      });
      if (!step) return;
      if (step.kind === 'inner') s.setInnerPageNavigateTo(step.index);
      else s.mobileNavChange(NAV_LIST[step.index], source);
    };
    // As the original: a tap while a step is still running (or within the spacing after one) is ignored, not
    // queued, so two quick taps move one section on both decks.
    if (getSectionState().phase === 'moving') return;
    if (performance.now() - lastStepAt < STEP_SPACING_MS) return;
    run(isUp);
  }, []);
}

/** The accessible name of an arrow: it names where the step goes. Ends in "section" (one section or a page of it). */
function useArrowLabel(isUp: boolean) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const step = resolveStep(isUp, {
    pageId: currentPage.id,
    pageIndex: currentPageIndex,
    innerIndex: innerPageIndex,
    innerTotal: innerPageTotal,
  });
  const verb = isUp ? 'Previous' : 'Next';
  if (!step) return `${verb} section`;
  if (step.kind === 'inner') return `${verb} page, ${step.index + 1} of ${innerPageTotal} in this section`;
  return `${verb}: ${sectionName(NAV_LIST[step.index].title)} section`;
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const step = useMobileSectionStep();
  const label = useArrowLabel(Boolean(isUp));

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        // 44 px visible circle; the ::before pseudo-element extends the touch target to 52 px.
        // The original's 40 px circles, 12 px apart; a 44 px hit area around each (tap-area), not a bigger circle.
        'flex-center relative h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm tap-area',
        hasBlackArrow(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={() => step(Boolean(isUp))}
    >
      <ArrowDownSVG aria-hidden="true" className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </button>
  );
}
