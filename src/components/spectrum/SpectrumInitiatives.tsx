import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { useReducedMotionPref } from '@/motion/preference';
import { MOTION } from '@/motion/presets';
import { DURATION, EASE } from '@/motion/tokens';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { cloneElement, memo, useId, useState } from 'react';
import { SpectrumLink } from './SpectrumItem';

type Layout = 'columns' | 'publications';

interface RouteProps {
  executeSpectrumRoute: (key: string) => void;
  updateUrlAndExecute: (key: string) => void;
  routeConfigs: SpectrumRouteConfig[];
}

interface SpectrumInitiativesProps extends RouteProps {
  items: SpectrumItemInfo[];
  layout?: Layout;
  onSelect: (index: number) => void;
}

/**
 * The control at the end of a group's heading that opens the links kept back at rest (the group's collapsedCount) and
 * closes them again. Closed it reads "more" with a chevron; open it is the chevron alone, turned upward, so no label is
 * shown that the page does not otherwise use.
 */
function MoreToggle({ expanded, controls, onToggle }: { expanded: boolean; controls: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={expanded ? 'Show fewer' : undefined}
      onClick={onToggle}
      className="spectrum-more relative -my-1.5 -mr-1.5 ml-auto flex shrink-0 items-center gap-px self-baseline rounded-sm p-1.5 font-text text-[12px]/5 font-medium text-white/80 transition-colors tap-area hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mobile:text-[13px] desktop2k:text-sm"
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
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotionPref();
  const restCount = item.collapsedCount ?? item.links.length;
  const collapsible = item.links.length > restCount;
  const links = collapsible && !expanded ? item.links.slice(0, restCount) : item.links;

  return (
    <article className="min-w-0" onMouseEnter={onSelect} onFocus={onSelect}>
      <div className="flex items-start gap-2.5">
        {cloneElement(item.icon, {
          className: cn(item.icon.props.className, 'mt-0.5 size-5 shrink-0 fill-white medium:size-[20px] expanded:size-[20px]'),
        })}
        <div
          className={cn(
            'min-w-0',
            collapsible && 'self-baseline',
            layout === 'publications' && 'flex flex-wrap items-baseline gap-x-4 gap-y-1',
          )}
        >
          {/* Type roles (RWD-01): initiative title-sm, its Chinese name caption, the links body-sm. */}
          <h2 className="bilingual-font text-[clamp(19px,1.6vw,30px)]/tight font-semibold text-white">{item.title}</h2>
          <p className={cn('bilingual-font text-sm/5 font-medium text-white/65', layout === 'columns' && 'mt-2')}>
            {item.titleCn}
          </p>
        </div>
        {collapsible && <MoreToggle expanded={expanded} controls={listId} onToggle={() => setExpanded((open) => !open)} />}
      </div>
      <ul
        id={listId}
        className={cn(
          'mt-4',
          // Papers: two columns on a medium window, where three put four or five lines in each title.
          layout === 'publications'
            ? 'grid grid-cols-3 gap-x-10 gap-y-4 mobile:grid-cols-1 medium:grid-cols-2 medium:gap-x-[24px] expanded:gap-x-[32px]'
            : 'flex flex-col gap-2 mobile:gap-0 coarse:gap-0',
          // Long titles (the phone's papers page) wrap over several lines: keep a gap between them.
          layout === 'columns' && item.links.some((l) => l.label.length >= 60) && 'mobile:gap-2 coarse:gap-2',
          // A landscape tablet (coarse pointer, 840-1199 px): the 44 px link boxes would push the logo wall under
          // the bottom controls, so an initiative's links run in two columns there; a phone in landscape (under
          // 480 px tall) takes three, so the first page fits above the section arrows.
          layout === 'columns' &&
            'expanded:landscape:coarse:grid expanded:landscape:coarse:grid-cols-2 expanded:landscape:coarse:gap-x-4 [@media(max-height:479.98px)]:grid [@media(max-height:479.98px)]:grid-cols-3',
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
                  // The original's link sizes. On a coarse pointer each link is a 44 px tall box (RWD-06); the
                  // mouse layout keeps its line boxes.
                  'min-w-0 text-white/80 [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-[12px] [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.6] mobile:[&_.spectrum-link-text]:!text-[13px] desktop2k:[&_.spectrum-link-text]:!text-sm [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-white [&_a]:block [&_a]:rounded-sm mobile:[&_a]:flex mobile:[&_a]:min-h-9 mobile:[&_a]:items-center coarse:[&_a]:flex coarse:[&_a]:min-h-[44px] coarse:[&_a]:items-center',
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
    </article>
  );
}

function SpectrumInitiatives({
  items,
  layout = 'columns',
  onSelect,
  executeSpectrumRoute,
  updateUrlAndExecute,
  routeConfigs,
}: SpectrumInitiativesProps) {
  return (
    <section
      aria-label={layout === 'publications' ? 'Spectrum publications' : 'Spectrum initiatives'}
      className={cn(
        'grid gap-x-10 gap-y-7 mobile:grid-cols-1 medium:gap-x-[24px] expanded:gap-x-[32px]',
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
