import { cn } from '@/utils';
import { memo, forwardRef } from 'react';
import { PortfolioItemInfo } from './portfolioData';

interface PortfolioItemProps {
  item: PortfolioItemInfo;
  link?: string;
  onItemClick?: (item: PortfolioItemInfo) => void;
  onMouseEnter?: () => void;
  className?: string;
  isHover?: boolean;
  isGridMode?: boolean;
}

const PortfolioItem = memo(
  forwardRef<HTMLDivElement, PortfolioItemProps>(({ item, onItemClick, className, isHover, onMouseEnter, isGridMode }, ref) => {
    const { title, subTitle, description, image } = item;

    const handleClick = () => {
      onItemClick?.(item);
    };
    return (
      <div
        ref={ref}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        className={cn(
          'mobile:flex-center relative h-[15.5rem] w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:flex-col mobile:pt-0',
          isGridMode ? 'mobile:h-full mobile:w-full mobile:justify-center' : 'mobile:h-[30svh] mobile:w-[100dvw]',
          className,
        )}
      >
        <div className={cn('flex items-center justify-center', isGridMode ? 'h-12 mobile:h-15' : 'h-20 mobile:h-15')}>
          {image}
        </div>
        <div className={cn('text-center font-semibold', isGridMode ? 'mt-2 mobile:mt-3' : 'mt-7 mobile:mt-3')}>
          <h4
            className={cn(
              'fund-title flex-center gap-2.5 font-oxanium tracking-normal mobile:whitespace-nowrap',
              isGridMode ? 'text-sm/5 font-semibold' : 'text-xl/6',
            )}
          >
            <img src="/svgs/select.svg" className="title-selected w-5.5 rotate-180 opacity-0" alt="" />
            {title}
            <img src="/svgs/select.svg" className="title-selected w-5.5 opacity-0" alt="" />
          </h4>
          <p
            className={cn(
              'fund-desc mx-auto text-xs/5',
              isGridMode
                ? 'mt-3 line-clamp-2 min-h-8 w-full px-2 text-[.625rem]/4 font-medium'
                : 'mt-4 min-h-10 w-72 mobile:mt-2 mobile:min-h-5',
            )}
          >
            {description}
          </p>
          {subTitle && !isGridMode && (
            <div className="fund-subtitle mx-auto py-1.5 text-xs/3 font-semibold text-gray-350 mobile:mt-3">{subTitle}</div>
          )}
        </div>
      </div>
    );
  }),
);

PortfolioItem.displayName = 'PortfolioItem';

export default PortfolioItem;
