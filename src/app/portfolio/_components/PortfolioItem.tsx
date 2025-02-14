import { cn } from '@/utils';
import { memo, forwardRef } from 'react';
import { PortfolioItemInfo } from './portfolioData';

interface PortfolioItemProps {
  item: PortfolioItemInfo;
  link?: string;
  onClick: () => void;
  className?: string;
  isHover?: boolean;
}

const PortfolioItem = memo(
  forwardRef<HTMLDivElement, PortfolioItemProps>(({ item, onClick, className, isHover }, ref) => {
    const { title, subTitle, description, image } = item;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'mobile:flex-center relative h-60 w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:h-[30svh] mobile:w-[100dvw] mobile:flex-col mobile:pt-0',
          className,
        )}
      >
        <div className="flex h-20 items-center justify-center mobile:h-[3.875rem]">{image}</div>
        <div className="mt-4 text-center font-semibold">
          <h4 className="fund-title font-oxanium text-base/6 mobile:text-xl/6">{title}</h4>
          <p className="fund-desc mx-auto mt-3 w-72 text-xs/5">{description}</p>
          {subTitle && (
            <div className="fund-subtitle mx-auto mt-3 w-44 py-1.5 text-xs/3 font-semibold text-gray-350">{subTitle}</div>
          )}
        </div>
      </div>
    );
  }),
);

PortfolioItem.displayName = 'PortfolioItem';

export default PortfolioItem;
