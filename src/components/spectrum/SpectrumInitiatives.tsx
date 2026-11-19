import { FITTED_TAP_AREA, useFittedTapArea } from '@/hooks/useFittedTapArea';
import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { jotaiStore } from '@/atoms/store';
import { noteInnerPage, registerInnerPage } from '@/motion/innerPages';
import { useReducedMotionPref } from '@/motion/preference';
import { MOTION } from '@/motion/presets';
import { DURATION, EASE } from '@/motion/tokens';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { atom, useAtom } from 'jotai';
import { cloneElement, memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import { SpectrumLink } from './SpectrumItem';

type Layout = 'columns' | 'publications';

/**
 * Which groups are open, by group title, for the visit: one piece of state outside the page components, so the
 * desktop deck and the phone's papers page keep it alike (the phone page remounts on every step).
 */
const openGroupsAtom = atom<Record<string, boolean>>({});

// The open groups are one of Spectrum's inner pages (NAV-02): kept in the history entry while Spectrum is the section in
// view, and opened again when Back, Forward or a reload brings the entry back. All closed is the start.
if (typeof window !== 'undefined') {
  registerInnerPage(
    'spectrum_page',
    'papers',
    () => {
      const open = Object.keys(jotaiStore.get(openGroupsAtom)).filter((title) => jotaiStore.get(openGroupsAtom)[title]);
      return open.length ? open.sort() : undefined;
    },
    (value) => {
      if (Array.isArray(value)) {
        const titles = value.filter((title): title is string => typeof title === 'string');
        jotaiStore.set(openGroupsAtom, Object.fromEntries(titles.map((title) => [title, true])));
      }
      return true;
    },
  );
  jotaiStore.sub(openGroupsAtom, () => noteInnerPage('spectrum_page'));
}

/**
 * While a group's list opens or closes, a press on that group does nothing, its links and its own control alike: "more"
 * moves when it is pressed and a paper slides under the pointer, so a double click (or a second tap up to a second
 * later) opened that paper in a new tab; and a second press on the moving control turned the list straight back, so a
 * double click could never close it. A double click therefore ends in the state its first press asked for, opening
 * or closing. The window covers the list's own animation (DURATION.base plus a 50 ms stagger per link) and is never
 * less than half a second, reduced motion included.
 */
const SETTLE_MIN_MS = 500;
const settleMs = (extraLinks: number) => Math.max(SETTLE_MIN_MS, Math.round((DURATION.base + extraLinks * 0.05) * 1000) + 150);

/** The place a press on the control was made: the control's box then, at least 44 px around its centre on touch. */
type PressPlace = { left: number; top: number; right: number; bottom: number; until?: number };
/**
 * On touch the place also ends by time. The fault it guards against is a second tap within about a second and a half;
 * a finger has no hover to leave the place with, and on a wide phone title words lie under part of the 44 px place,
 * so after this long a tap there is a new intention and goes to what is drawn. A mouse keeps the place until it moves.
 */
const TOUCH_PLACE_MS = 3000;
function pressPlace(button: HTMLElement, pointerType: string): PressPlace {
  const r = button.getBoundingClientRect();
  const half = pointerType === 'mouse' ? 0 : 22;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return {
    until: pointerType === 'mouse' ? undefined : performance.now() + TOUCH_PLACE_MS,
    left: Math.min(r.left, cx - half),
    right: Math.max(r.right, cx + half),
    top: Math.min(r.top, cy - half),
    bottom: Math.max(r.bottom, cy + half),
  };
}
const inside = (p: PressPlace, x: number, y: number) => x >= p.left && x <= p.right && y >= p.top && y <= p.bottom;

interface RouteProps {
  executeSpectrumRoute: (key: string) => void;
  updateUrlAndExecute: (key: string) => void;
  routeConfigs: SpectrumRouteConfig[];
}

interface SpectrumInitiativesProps extends RouteProps {
  items: SpectrumItemInfo[];
  layout?: Layout;
  /** The region's name, where the layout does not say it (the phone's papers page uses the column layout). */
  label?: string;
  onSelect: (index: number) => void;
}

/**
 * The control at the end of a group's heading that opens the links kept back at rest (the group's collapsedCount) and
 * closes them again. Closed it reads "more" with a chevron; open it is the chevron alone, turned upward, so no label is
 * shown that the page does not otherwise use.
 */
function MoreToggle({
  expanded,
  controls,
  onToggle,
}: {
  expanded: boolean;
  controls: string;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // On a touch screen the hit area grows towards 44 px only into space that is nobody's: never into the link row below.
  const ref = useFittedTapArea<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={expanded ? 'Show fewer' : undefined}
      onClick={onToggle}
      className={`spectrum-more relative -my-1.5 -mr-1.5 ml-auto flex shrink-0 items-center gap-px self-baseline rounded-sm p-1.5 font-text text-[12px]/5 font-medium text-white/80 transition-colors tap-area hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mobile:text-[0.8125rem] desktop2k:text-sm ${FITTED_TAP_AREA}`}
    >
      {!expanded && <span>more</span>}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className={cn('size-[1em] transition-transform duration-300', expanded && '-rotate-90')}
      >
        <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Initiative({
  item,
  layout,
  onSelect,
  executeSpectrumRoute,
  updateUrlAndExecute,
  routeConfigs,
}: RouteProps & { item: SpectrumItemInfo; layout: Layout; onSelect: () => void }) {
  const listId = useId();
  const [openGroups, setOpenGroups] = useAtom(openGroupsAtom);
  const expanded = Boolean(openGroups[item.title]);
  const [settling, setSettling] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduceMotion = useReducedMotionPref();
  const restCount = item.collapsedCount ?? item.links.length;
  const collapsible = item.links.length > restCount;
  const links = collapsible && !expanded ? item.links.slice(0, restCount) : item.links;

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // The place where the control was pressed stays the control until the visitor leaves it (the lead's rule of
  // 2026-11-17): the control moves when pressed and a paper, a logo or an initiative link slides under the pointer,
  // and a time limit alone cannot tell a second press there from a new one, since the visitor has not moved. So a
  // further press inside the control's box as it was when pressed goes to the control (ignored while the list settles,
  // a toggle after it), never to what is under it now. It ends when a mouse leaves that box; on touch 3 s after the
  // press (TOUCH_PLACE_MS) or when a touch lands anywhere else; and when the page scrolls or wheels, the window is
  // resized or loses focus, or the group unmounts (the phone's page steps). Keyboard presses (detail 0) neither start
  // nor meet it: no stop and nothing announced is added.
  const pressedAt = useRef<PressPlace | null>(null);
  const toggleRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Only a group with a control can set a place.
    if (!collapsible) return;
    // Where the last press went down, before the browser's touch adjustment may move the click onto a nearby link.
    let downInside = false;
    const current = () => {
      const place = pressedAt.current;
      if (place?.until !== undefined && performance.now() > place.until) pressedAt.current = null;
      return pressedAt.current;
    };
    const onClick = (event: MouseEvent) => {
      const place = current();
      if (!place || event.detail === 0 || !(downInside || inside(place, event.clientX, event.clientY))) return;
      event.preventDefault();
      event.stopPropagation();
      toggleRef.current();
    };
    const onPointerMove = (event: PointerEvent) => {
      const place = pressedAt.current;
      if (place && event.pointerType === 'mouse' && !inside(place, event.clientX, event.clientY)) pressedAt.current = null;
    };
    const onPointerDown = (event: PointerEvent) => {
      const place = current();
      downInside = Boolean(place && inside(place, event.clientX, event.clientY));
      if (place && !downInside) pressedAt.current = null;
    };
    const leave = () => {
      pressedAt.current = null;
    };
    window.addEventListener('click', onClick, true);
    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('wheel', leave, { capture: true, passive: true });
    window.addEventListener('scroll', leave, { capture: true, passive: true });
    // The place is a box in window coordinates: a resize can move the layout under it, and a visitor who switches away
    // has left it.
    window.addEventListener('resize', leave);
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('wheel', leave, true);
      window.removeEventListener('scroll', leave, true);
      window.removeEventListener('resize', leave);
      window.removeEventListener('blur', leave);
    };
  }, [collapsible]);

  const toggle = useCallback(() => {
    // A pending timer means the list is still moving: the press is not taken (see settleMs).
    if (settleTimer.current !== undefined) return;
    setOpenGroups((groups) => ({ ...groups, [item.title]: !groups[item.title] }));
    setSettling(true);
    settleTimer.current = setTimeout(
      () => {
        settleTimer.current = undefined;
        setSettling(false);
      },
      settleMs(item.links.length - restCount),
    );
  }, [setOpenGroups, item.title, item.links.length, restCount]);

  useEffect(() => {
    toggleRef.current = toggle;
  }, [toggle]);

  const onControl = (event: React.MouseEvent<HTMLButtonElement>) => {
    const native = event.nativeEvent as PointerEvent;
    if (event.detail > 0) pressedAt.current = pressPlace(event.currentTarget, native.pointerType || 'mouse');
    toggle();
  };

  return (
    <article className="relative min-w-0" onMouseEnter={onSelect} onFocus={onSelect}>
      <div className="flex items-start gap-2.5">
        {cloneElement(item.icon, {
          className: cn(item.icon.props.className, 'mt-0.5 size-5 shrink-0 fill-white'),
        })}
        <div
          className={cn(
            'min-w-0',
            collapsible && 'self-baseline',
            layout === 'publications' && 'flex flex-wrap items-baseline gap-x-4 gap-y-1',
          )}
        >
          {/* Type roles (RWD-01): initiative title-sm, its Chinese name caption, the links body-sm. */}
          {/* The laptop deck: the original's clamp. The phone deck: its 19 px in the deck's unit, so an upright tablet
              draws it at the same factor as every other text of the deck. */}
          <h2 className="bilingual-font text-[clamp(19px,1.6vw,30px)]/tight font-semibold text-white mobile:text-[1.1875rem]">
            {item.title}
          </h2>
          <p className={cn('bilingual-font text-sm/5 font-medium text-white/65', layout === 'columns' && 'mt-2')}>
            {item.titleCn}
          </p>
        </div>
        {collapsible && <MoreToggle expanded={expanded} controls={listId} onToggle={onControl} />}
      </div>
      <ul
        id={listId}
        // While the list opens or closes its links take no press (see settleMs).
        onClickCapture={
          settling
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : undefined
        }
        className={cn(
          'mt-4',
          settling && 'pointer-events-none',
          // Papers: two columns on a medium window, where three put four or five lines in each title.
          layout === 'publications'
            ? 'grid grid-cols-3 gap-x-10 gap-y-[calc(1rem-var(--paper-row-cut,0px))] mobile:grid-cols-1'
            : 'flex flex-col gap-2 mobile:gap-0',
          // Long titles (the phone's papers page) wrap over several lines: keep a gap between them.
          layout === 'columns' && item.links.some((l) => l.label.length >= 60) && 'mobile:gap-2',
          // A short phone (375x667) with the six papers open: 8 px between them left the last line 5 px under the
          // page's bottom edge; 4 px fits it whole. Only open, so the rest picture is unchanged.
          layout === 'columns' &&
            expanded &&
            item.links.some((l) => l.label.length >= 60) &&
            'mobile:[@media(max-height:700px)]:!gap-1',
          // A phone in landscape (under 480 px tall): an initiative's links run in three columns 16 px apart, so the
          // first page fits above the section arrows (the column gap came from the removed tablet rule before).
          layout === 'columns' &&
            '[@media(max-height:479.98px)]:grid [@media(max-height:479.98px)]:grid-cols-3 [@media(max-height:479.98px)_and_(pointer:coarse)]:!gap-x-4',
        )}
      >
        <AnimatePresence initial={false}>
          {links.map((link, index) => {
            // Links kept back at rest arrive one after another when the group is opened; the others never animate.
            const extra = collapsible && index >= restCount;
            return (
              <motion.li
                key={link.label}
                initial={extra ? { opacity: 0, y: reduceMotion ? 0 : 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
                transition={
                  reduceMotion
                    ? MOTION.instant
                    : { duration: DURATION.base, delay: extra ? (index - restCount) * 0.05 : 0, ease: EASE.out }
                }
                className={cn(
                  // The original's link sizes. On the phone deck with a touch screen each link is a box 44 px tall in the deck's
                  // unit (RWD-06), so an upright tablet keeps the phone's picture at its factor; the laptop deck keeps its
                  // line boxes on every pointer.
                  'min-w-0 text-white/80 [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-[12px] [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.6] mobile:[&_.spectrum-link-text]:!text-[0.8125rem] desktop2k:[&_.spectrum-link-text]:!text-sm [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-white [&_a]:block [&_a]:rounded-sm mobile:[&_a]:flex mobile:[&_a]:min-h-9 mobile:[&_a]:items-center mobile:coarse:[&_a]:flex mobile:coarse:[&_a]:min-h-[2.75rem] mobile:coarse:[&_a]:items-center',
                  // The laptop deck with a touch screen (a tablet on its side): the picture stays exactly the laptop's.
                  // Each link only gets an invisible touch area reaching a quarter of a unit above and below its row,
                  // no more than half the gap to the next row, so two areas never meet.
                  'notMobile:coarse:[&_a]:relative notMobile:coarse:[&_a]:before:absolute notMobile:coarse:[&_a]:before:-inset-y-1 notMobile:coarse:[&_a]:before:inset-x-0 notMobile:coarse:[&_a]:before:content-[""]',
                )}
              >
                <SpectrumLink
                  item={link}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {/* The group's list with every link, never painted or announced, so the desktop deck can measure the height the
          composition needs OPEN while it is closed (Spectrum's fit scale). Plain text, no links. */}
      {collapsible && (
        // A zero-height clip around it, so the copy never adds to the page's scrollable area.
        <div aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-0 h-0 overflow-hidden">
          <ul
            data-open-measure=""
            className={cn(
              'mt-4',
              layout === 'publications'
                ? 'grid grid-cols-3 gap-x-10 gap-y-[calc(1rem-var(--paper-row-cut,0px))] mobile:grid-cols-1'
                : 'flex flex-col gap-2 mobile:gap-0',
            )}
          >
            {item.links.map((link) => (
              <li
                key={link.label}
                className="min-w-0 mobile:coarse:flex mobile:coarse:min-h-[2.75rem] mobile:coarse:items-center [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-[12px] [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.6] mobile:[&_.spectrum-link-text]:!text-[0.8125rem] desktop2k:[&_.spectrum-link-text]:!text-sm"
              >
                <SpectrumLink item={{ ...link, link: undefined }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function SpectrumInitiatives({
  items,
  layout = 'columns',
  label,
  onSelect,
  executeSpectrumRoute,
  updateUrlAndExecute,
  routeConfigs,
}: SpectrumInitiativesProps) {
  return (
    <section
      aria-label={label ?? (layout === 'publications' ? 'Spectrum publications' : 'Spectrum initiatives')}
      className={cn(
        'grid gap-x-10 gap-y-7 mobile:grid-cols-1',
        layout === 'publications' ? 'grid-cols-1 border-t border-white/15 pt-5 wideShort:pt-3' : 'grid-cols-3',
      )}
    >
      {items.map((item, index) => (
        <Initiative
          key={item.title}
          item={item}
          layout={layout}
          onSelect={() => onSelect(index)}
          executeSpectrumRoute={executeSpectrumRoute}
          updateUrlAndExecute={updateUrlAndExecute}
          routeConfigs={routeConfigs}
        />
      ))}
    </section>
  );
}

export default memo(SpectrumInitiatives);
