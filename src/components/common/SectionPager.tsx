import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { FITTED_TAP_AREA, useFittedTapArea } from '@/hooks/useFittedTapArea';
import { getSectionState, sectionStateAtom, type SectionSource } from '@/motion/sectionController';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { hasBlackArrow, hasInnerPage, NAV_LIST } from '../nav/nav';

interface SectionPagerProps {
  className?: string;
}

/**
 * The section pager of the paged deck (phones): an up and a down button that step through the sections and through
 * the inner pages of Portfolio, Insights and Spectrum, one tap one step. A different control from the desktop
 * deck's PageArrows, which scroll a continuous deck, so it stays its own part (RWD-02).
 */
export default function SectionPager({ className }: SectionPagerProps) {
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
 * Minimum time between two steps; a step asked for sooner is ignored, as on the original, unless it is a second tap on
 * the arrow of the same direction (NAV-06). Shared by every arrow and the swipe (module scope): on Connect a tap on the
 * one arrow brings in a second arrow under the finger, and a second quick tap must not be taken by a control that was
 * not there when it began (it points the other way, so it is still ignored).
 */
const STEP_SPACING_MS = 500;
let lastStepAt = 0;
/** The last step's direction and input: within the spacing, a second tap on the same arrow is a second step. */
let lastStep: { up: boolean; source: SectionSource } | null = null;
/**
 * A step asked for while a section change is still running: kept, one at most (the latest wins),
 * and taken once the running step has landed and the section reached knows its inner pages (NAV-06: a second tap
 * during a transition is not lost; on the original it was dropped).
 */
let queuedStep: { up: boolean } | null = null;

/** One step through the phone experience, shared by the arrow buttons and the swipe gesture. */
export function useSectionStep() {
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

  const runRef = useRef<((up: boolean) => void) | null>(null);
  const step = useCallback((isUp: boolean, source: SectionSource = 'arrow') => {
    const run = (up: boolean) => {
      const s = stateRef.current;
      lastStepAt = performance.now();
      lastStep = { up, source };
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
    runRef.current = run;
    // A tap while a section change is still running waits for it (queuedStep) instead of being dropped as on the
    // original, so two quick taps move two steps.
    if (getSectionState().phase === 'moving') {
      queuedStep = { up: isUp };
      return;
    }
    // Within the spacing after a step a tap is still ignored when it is the tap of a control that came under the finger
    // as the step ended (Connect's up arrow, where the down arrow was) or a swipe; a second tap on the arrow of the
    // same direction is a second step (NAV-06: two taps, two steps).
    const sameArrow = source === 'arrow' && lastStep?.source === 'arrow' && lastStep.up === isUp;
    if (performance.now() - lastStepAt < STEP_SPACING_MS && !sameArrow) return;
    run(isUp);
  }, []);

  // The waiting step is taken when the step before it has landed (the controller is idle) and the section reached
  // knows its inner pages (a paged section sets their count as it is entered): that is when one step from it can be
  // resolved. Every arrow and the swipe run this; the first to see the step ready takes it.
  const phase = useAtomValue(sectionStateAtom).phase;
  useEffect(() => {
    if (!queuedStep || phase !== 'idle') return;
    if (hasInnerPage(currentPage.id) && innerPageTotal === 0) return;
    const { up } = queuedStep;
    queuedStep = null;
    runRef.current?.(up);
  }, [phase, currentPage, innerPageIndex, innerPageTotal]);

  return step;
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
  const step = useSectionStep();
  const label = useArrowLabel(Boolean(isUp));
  // On a touch screen the hit area is 44 px, reaching only into space that is nobody's: where the other arrow (12 px
  // away) or another control stands closer, each takes at most half the gap (NAV-06, RWD-06). Nothing drawn changes.
  // Fitted again at every step (the label names the step): the arrow's border and its neighbours change with the page.
  const ref = useFittedTapArea<HTMLButtonElement>(label);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        // The original's 40 px circles, 12 px apart; a fitted 44 px hit area around each (tap-area with the fitted
        // sides of useFittedTapArea), not a bigger circle.
        'flex-center relative h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm tap-area',
        FITTED_TAP_AREA,
        hasBlackArrow(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={() => step(Boolean(isUp))}
    >
      <ArrowDownSVG aria-hidden="true" className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </button>
  );
}
