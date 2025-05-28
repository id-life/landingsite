import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { cloneElement, forwardRef, memo } from 'react';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  onClick?: () => void;
  className?: string;
  isHover?: boolean;
}

const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(({ item, onClick, className, isHover }, ref) => {
    const { title, titleCn, icon, links, className: itemClassName } = item;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'spectrum-item relative h-[13.75rem] w-[25rem] cursor-pointer overflow-visible p-4 text-foreground',
          className,
        )}
      >
        <div className={cn('flex items-start gap-1.5', itemClassName)}>
          {cloneElement(icon, { className: 'spectrum-icon size-7.5 shrink-0 fill-white' })}
          <div className="flex flex-col">
            <h4 className="spectrum-title bilingual-font whitespace-nowrap text-[1.625rem]/7.5 font-semibold capitalize">
              {title}
            </h4>
            <h4 className="spectrum-title-cn bilingual-font mt-2 text-xl/6 font-bold capitalize">{titleCn}</h4>
            <div className="mt-5 flex flex-col">
              {links?.length
                ? links.map((item) => {
                    const { label, link, isComingSoon, onClick } = item;
                    const hasLink = Boolean(link || onClick);
                    return (
                      <div key={label} className="relative flex items-center gap-1">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (!link && !onClick) return;
                            if (onClick) onClick();
                            if (link) window.open(link, '_blank');
                          }}
                        >
                          <p
                            className={cn('spectrum-link-text group relative font-poppins text-xs/5 font-medium capitalize', {
                              'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100':
                                hasLink,
                            })}
                          >
                            {label}
                            {/* {hasLink && (
                              <>
                                <img
                                  src="/svgs/select.svg"
                                  className="spectrum-selected-icon absolute -left-10 top-1/2 w-5.5 -translate-y-1/2 rotate-180 opacity-0 group-hover:opacity-100"
                                  alt=""
                                />
                                <img
                                  src="/svgs/select.svg"
                                  className={cn(
                                    'spectrum-selected-icon absolute -right-10 top-1/2 w-5.5 -translate-y-1/2 opacity-0 group-hover:opacity-100',
                                    {
                                      '-right-[112px]': isComingSoon,
                                    },
                                  )}
                                  alt=""
                                />
                              </>
                            )} */}
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
        </div>
      </div>
    );
  }),
);

SpectrumItem.displayName = 'SpectrumItem';

export default SpectrumItem;
