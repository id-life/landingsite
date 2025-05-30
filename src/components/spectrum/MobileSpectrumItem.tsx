import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { cloneElement, forwardRef, memo } from 'react';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  onClick?: () => void;
  className?: string;
  isHover?: boolean;
}

const MobileSpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(({ item, onClick, className, isHover }, ref) => {
    const { title, titleCn, icon, links } = item;

    const { trackEvent } = useGA();

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'spectrum-item group relative flex h-full cursor-pointer flex-col items-center justify-center text-foreground',
          className,
        )}
      >
        <div className="flex items-start gap-1.5">
          {cloneElement(icon, { className: 'spectrum-icon size-7.5 shrink-0 fill-white' })}
          <div className="flex flex-col">
            <h4 className="spectrum-title bilingual-font whitespace-nowrap text-[1.625rem]/7.5 font-semibold capitalize">
              {title}
            </h4>
          </div>
        </div>
        <h4 className="spectrum-title-cn bilingual-font mt-2 text-xl/6 font-bold capitalize">{titleCn}</h4>
        <div className="mt-5 flex flex-col">
          {links?.length
            ? links.map((item) => {
                const { label, link, isComingSoon, onClick, labelClassName } = item;
                return (
                  <div key={label} className="flex-center gap-1 text-center">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (!link && !onClick) return;
                        trackEvent({
                          name: GA_EVENT_NAMES.SPECTRUM_CLICK,
                          label,
                        });
                        if (onClick) onClick();
                        if (link) window.open(link, '_blank');
                      }}
                    >
                      <p
                        className={cn(
                          'spectrum-link-text relative font-poppins text-xs/5 font-medium capitalize',
                          {
                            'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100':
                              link || onClick,
                          },
                          labelClassName,
                        )}
                      >
                        {label}
                      </p>
                    </a>
                    {isComingSoon && (
                      <span className="flex-center inline-block h-5 rounded-sm bg-white/20 px-1 font-oxanium text-xs capitalize text-white/50 backdrop-blur-2xl">
                        coming soon
                      </span>
                    )}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }),
);

MobileSpectrumItem.displayName = 'MobileSpectrumItem';

export default MobileSpectrumItem;
