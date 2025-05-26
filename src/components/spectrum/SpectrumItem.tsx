import { SpectrumItemInfo } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { cloneElement, forwardRef, memo } from 'react';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  onClick: () => void;
  className?: string;
  isHover?: boolean;
}

const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(({ item, onClick, className, isHover }, ref) => {
    const { title, titleCn, icon, links } = item;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn('spectrum-item group relative h-[17.5rem] w-[23.75rem] cursor-pointer text-foreground', className)}
      >
        <img
          src="/svgs/select.svg"
          className="spectrum-selected-icon absolute left-0 top-1/2 w-5.5 -translate-y-1/2 rotate-180 opacity-0"
          alt=""
        />
        <img
          src="/svgs/select.svg"
          className="spectrum-selected-icon absolute right-0 top-1/2 w-5.5 -translate-y-1/2 opacity-0"
          alt=""
        />
        <div className="flex items-start gap-1.5">
          {cloneElement(icon, { className: 'spectrum-icon size-7.5 shrink-0 fill-white' })}
          <div className="flex flex-col">
            <h4 className="spectrum-title bilingual-font whitespace-nowrap text-[1.625rem]/7.5 font-semibold capitalize">
              {title}
            </h4>
            <h4 className="spectrum-title-cn bilingual-font mt-2 text-xl/6 font-bold capitalize">{titleCn}</h4>
            <div className="mt-5 flex flex-col">
              {links?.length
                ? links.map((link) => (
                    <div key={link.label} className="flex items-center gap-1">
                      <p
                        className={cn(
                          'spectrum-link-text relative font-poppins text-xs/5 font-medium capitalize',
                          'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
                        )}
                      >
                        {link.label}
                      </p>
                    </div>
                  ))
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
