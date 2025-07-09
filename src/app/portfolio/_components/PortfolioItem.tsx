import { cn } from '@/utils';
import { memo, forwardRef } from 'react';
import { PortfolioItemInfo } from './portfolioData';

interface PortfolioItemProps {
  item: PortfolioItemInfo;
  link?: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  className?: string;
  isHover?: boolean;
}

const PortfolioItem = memo(
  forwardRef<HTMLDivElement, PortfolioItemProps>(({ item, onClick, className, isHover, onMouseEnter }, ref) => {
    const { title, subTitle, description, image } = item;
    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={cn(
          'mobile:flex-center relative h-[15.5rem] w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:h-[30svh] mobile:w-[100dvw] mobile:flex-col mobile:pt-0',
          className,
        )}
      >
        <div className="flex h-20 items-center justify-center mobile:h-15">{image}</div>
        <div className="mt-7 text-center font-semibold mobile:mt-3">
          <h4 className="fund-title flex-center gap-2.5 font-oxanium text-xl/6 tracking-normal">
            <img src="/svgs/select.svg" className="title-selected w-5.5 rotate-180 opacity-0" alt="" />
            {title}
            <img src="/svgs/select.svg" className="title-selected w-5.5 opacity-0" alt="" />
          </h4>
          <p className="fund-desc mx-auto mt-4 min-h-10 w-72 text-xs/5 mobile:mt-2 mobile:min-h-5">{description}</p>
          {subTitle && (
            <div className="fund-subtitle mx-auto py-1.5 text-xs/3 font-semibold text-gray-350 mobile:mt-3">{subTitle}</div>
          )}
        </div>
      </div>
    );
  }),
);

PortfolioItem.displayName = 'PortfolioItem';

export default PortfolioItem;
