import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { cn } from '@/utils';
import { cloneElement, memo } from 'react';
import { SpectrumLink } from './SpectrumItem';

interface SpectrumInitiativesProps {
  items: SpectrumItemInfo[];
  layout?: 'columns' | 'publications';
  onSelect: (index: number) => void;
  executeSpectrumRoute: (key: string) => void;
  updateUrlAndExecute: (key: string) => void;
  routeConfigs: SpectrumRouteConfig[];
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
        layout === 'publications' ? 'grid-cols-1 border-t border-white/15 pt-5' : 'grid-cols-3',
      )}
    >
      {items.map((item, index) => {
        return (
          <article key={item.title} className="min-w-0" onMouseEnter={() => onSelect(index)} onFocus={() => onSelect(index)}>
            <div className="flex items-start gap-2.5">
              {cloneElement(item.icon, {
                className: cn(
                  item.icon.props.className,
                  'mt-0.5 size-5 shrink-0 fill-white medium:size-[20px] expanded:size-[20px]',
                ),
              })}
              <div className={cn('min-w-0', layout === 'publications' && 'flex flex-wrap items-baseline gap-x-4 gap-y-1')}>
                {/* Type roles (RWD-01): initiative title-sm, its Chinese name caption, the links body-sm. */}
                <h2 className="bilingual-font text-title-sm font-semibold leading-tight text-white">{item.title}</h2>
                <p className={cn('bilingual-font text-caption font-medium text-white/65', layout === 'columns' && 'mt-2')}>
                  {item.titleCn}
                </p>
              </div>
            </div>
            <ul
              className={cn(
                'mt-4',
                // Peer reviews: two columns on a medium window, where three put four or five lines in each title.
                layout === 'publications'
                  ? 'grid grid-cols-3 gap-x-10 gap-y-4 mobile:grid-cols-1 medium:grid-cols-2 medium:gap-x-[24px] expanded:gap-x-[32px]'
                  : 'flex flex-col gap-2 mobile:gap-0 coarse:gap-0',
                // A landscape tablet (coarse pointer, 840-1199 px): the 44 px link boxes would push the logo wall under
                // the bottom controls, so an initiative's links run in two columns there; a phone in landscape (under
                // 480 px tall) takes three, so the first page fits above the section arrows.
                layout === 'columns' &&
                  'expanded:landscape:coarse:grid expanded:landscape:coarse:grid-cols-2 expanded:landscape:coarse:gap-x-4 [@media(max-height:479.98px)]:grid [@media(max-height:479.98px)]:grid-cols-3',
              )}
            >
              {item.links.map((link) => (
                <li
                  key={link.label}
                  className={cn(
                    // The links are body-sm (the 12 px override is gone, RWD-01). On a coarse pointer each link is a
                    // 44 px tall box (RWD-06); the mouse layout keeps its line boxes.
                    'min-w-0 text-white/80 [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-body-sm [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.5] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-white [&_a]:block [&_a]:rounded-sm mobile:[&_a]:flex mobile:[&_a]:min-h-9 mobile:[&_a]:items-center coarse:[&_a]:flex coarse:[&_a]:min-h-[44px] coarse:[&_a]:items-center',
                    // Peer review titles are running text: body with a tighter leading (RWD-01's 16 px bar for runs of
                    // 60 characters or more). After the line above, so cn() keeps these.
                    layout === 'publications' && '[&_.spectrum-link-text]:!text-body [&_.spectrum-link-text]:!leading-[1.4]',
                  )}
                >
                  <SpectrumLink
                    item={link}
                    executeSpectrumRoute={executeSpectrumRoute}
                    updateUrlAndExecute={updateUrlAndExecute}
                    routeConfigs={routeConfigs}
                  />
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}

export default memo(SpectrumInitiatives);
