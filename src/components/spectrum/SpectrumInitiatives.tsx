import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { cn } from '@/utils';
import { cloneElement, memo } from 'react';
import { SpectrumLink } from './SpectrumItem';

interface SpectrumInitiativesProps {
  items: SpectrumItemInfo[];
  onSelect: (index: number) => void;
  executeSpectrumRoute: (key: string) => void;
  updateUrlAndExecute: (key: string) => void;
  routeConfigs: SpectrumRouteConfig[];
}

function SpectrumInitiatives({
  items,
  onSelect,
  executeSpectrumRoute,
  updateUrlAndExecute,
  routeConfigs,
}: SpectrumInitiativesProps) {
  return (
    <section
      aria-label="Spectrum initiatives"
      className="grid grid-cols-2 gap-x-8 gap-y-6 py-5 xl:gap-x-10 xl:py-8 mobile:grid-cols-1 mobile:gap-y-7 mobile:py-0 ipad:grid-cols-2 [@media(min-width:1100px)]:grid-cols-[1.2fr_0.95fr_0.8fr_1.35fr]"
    >
      {items.map((item, index) => {
        return (
          <article key={item.title} className="min-w-0" onMouseEnter={() => onSelect(index)} onFocus={() => onSelect(index)}>
            <header className="flex min-h-[4.5rem] items-start gap-2.5 mobile:min-h-0">
              {cloneElement(item.icon, { className: cn(item.icon.props.className, 'mt-0.5 size-5 shrink-0 fill-white') })}
              <div className="min-w-0">
                <h2 className="bilingual-font text-[clamp(19px,1.6vw,30px)]/tight font-semibold text-white">{item.title}</h2>
                <p className="bilingual-font mt-2 text-sm/5 font-medium text-white/65">{item.titleCn}</p>
              </div>
            </header>
            <ul className="mt-3 flex flex-col gap-2 pt-4 mobile:gap-0 mobile:pt-0">
              {item.links.map((link) => (
                <li
                  key={link.label}
                  className={cn(
                    'min-w-0 text-white/80 [&_.spectrum-link-text]:!whitespace-normal [&_.spectrum-link-text]:!text-[12px] [&_.spectrum-link-text]:!normal-case [&_.spectrum-link-text]:!leading-[1.6] mobile:[&_.spectrum-link-text]:!text-[13px] desktop2k:[&_.spectrum-link-text]:!text-sm [&_a]:block [&_a]:rounded-sm [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-white mobile:[&_a]:flex mobile:[&_a]:min-h-9 mobile:[&_a]:items-center',
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
