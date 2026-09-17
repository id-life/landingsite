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
        'grid gap-x-10 gap-y-7 mobile:grid-cols-1',
        layout === 'publications' ? 'grid-cols-1 border-t border-white/15 pt-5' : 'grid-cols-3',
      )}
    >
      {items.map((item, index) => {
        return (
          <article key={item.title} className="min-w-0" onMouseEnter={() => onSelect(index)} onFocus={() => onSelect(index)}>
            <header className="flex items-start gap-2.5">
              {cloneElement(item.icon, { className: cn(item.icon.props.className, 'mt-0.5 size-5 shrink-0 fill-white') })}
              <div className={cn('min-w-0', layout === 'publications' && 'flex flex-wrap items-baseline gap-x-4 gap-y-1')}>
                <h2 className="bilingual-font text-[clamp(19px,1.6vw,30px)]/tight font-semibold text-white">{item.title}</h2>
                <p className={cn('bilingual-font text-sm/5 font-medium text-white/65', layout === 'columns' && 'mt-2')}>
                  {item.titleCn}
                </p>
              </div>
            </header>
            <ul
              className={cn(
                'mt-4',
                layout === 'publications'
                  ? 'grid grid-cols-3 gap-x-10 gap-y-4 mobile:grid-cols-1'
                  : 'flex flex-col gap-2 mobile:gap-0',
              )}
            >
              {item.links.map((link) => (
                <li
                  key={link.label}
                  className={cn(
                    'min-w-0 text-white/80 [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-[12px] [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.6] mobile:[&_.spectrum-link-text]:!text-[13px] desktop2k:[&_.spectrum-link-text]:!text-sm [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-white [&_a]:block [&_a]:rounded-sm mobile:[&_a]:flex mobile:[&_a]:min-h-9 mobile:[&_a]:items-center',
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
