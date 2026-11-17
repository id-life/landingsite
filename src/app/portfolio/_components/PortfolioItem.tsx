import { cn } from '@/utils';
import { memo, forwardRef, Ref } from 'react';
import OutboundLink from '@/lib/analytics/outbound';
import { cancelInspect, inspectOnDwell } from '@/lib/analytics/inspect';
import { slugId } from '@/lib/analytics/track';
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

    // Tiles with a company link are real links (DATA-03: <a target=_blank>, one portfolio_outbound_click per click);
    // tiles without one (R3 Bio, Kangaroo Biomedical, Vitalia) are not interactive. A 600 ms mouse dwell is one
    // item_inspect per tile per page (the old per-pass portfolio_view hover event is gone).
    const hasLink = Boolean(item.link);
    const companyId = slugId(title);
    const shared = {
      onPointerEnter: (event: { pointerType?: string }) => {
        onMouseEnter?.();
        inspectOnDwell(event, companyId, 'portfolio_page');
      },
      onPointerLeave: cancelInspect,
      className: cn(
        hasLink && 'block',
        // The original tile, 15.5 units tall on every laptop-deck window (scaled with it, two versions only RWD-02).
        'mobile:flex-center relative w-[23.75rem] pt-3 text-foreground mobile:flex-col mobile:pt-0 notMobile:h-[15.5rem]',
        hasLink && 'cursor-pointer',
        isGridMode ? 'mobile:h-full mobile:w-full mobile:min-w-0 mobile:justify-center' : 'mobile:h-[30svh] mobile:w-[100dvw]',
        className,
      ),
    };
    const content = (
      <>
        <div
          className={cn(
            'flex items-center justify-center notMobile:px-3 notMobile:[&>img]:max-h-full notMobile:[&>img]:max-w-full notMobile:[&>img]:object-contain',
            // A phone window under 660 px tall (360x640) has three rows of 130 px for six tiles: the logo box is 48 px
            // there instead of 60, or a one-liner reached 2 to 6 px into the next row's logos.
            isGridMode
              ? 'h-12 mobile:h-15 shortScreen:h-10 shortScreen:px-1 shortScreen:[&_img]:max-h-full shortScreen:[&_img]:max-w-full shortScreen:[&_img]:object-contain shortScreen:[&_svg]:max-h-full shortScreen:[&_svg]:max-w-full [@media(min-height:480px)_and_(max-height:659.98px)]:mobile:h-12 [@media(min-height:480px)_and_(max-height:659.98px)]:mobile:[&_img]:max-h-full [@media(min-height:480px)_and_(max-height:659.98px)]:mobile:[&_img]:object-contain [@media(min-height:480px)_and_(max-height:659.98px)]:mobile:[&_svg]:max-h-full'
              : 'h-20 mobile:h-15',
          )}
        >
          {image}
        </div>
        <div
          className={cn(
            'text-center font-semibold shortScreen:w-full shortScreen:min-w-0',
            isGridMode ? 'mt-2 mobile:mt-3' : 'mt-7 mobile:mt-3',
          )}
        >
          <h3
            className={cn(
              'fund-title flex-center gap-2.5 font-display tracking-normal mobile:whitespace-nowrap notMobile:relative notMobile:min-h-12 notMobile:px-5.5 shortScreen:whitespace-normal shortScreen:leading-4',
              // The original's sizes (the owner's rule on font sizes): 20 units on the desktop deck, 14 px in the
              // phone grid.
              isGridMode ? 'text-sm/5 font-semibold' : 'text-xl/6',
            )}
          >
            <img
              src="/svgs/select.svg"
              className="title-selected w-5.5 shrink-0 rotate-180 opacity-0 notMobile:absolute notMobile:left-0 shortScreen:hidden"
              alt=""
            />
            <span className="min-w-0 notMobile:break-words">
              {title === 'Longevity.Technology' ? (
                <>
                  Longevity.
                  <wbr />
                  Technology
                </>
              ) : (
                title
              )}
            </span>
            <img
              src="/svgs/select.svg"
              className="title-selected w-5.5 shrink-0 opacity-0 notMobile:absolute notMobile:right-0 shortScreen:hidden"
              alt=""
            />
          </h3>
          <p
            className={cn(
              'fund-desc mx-auto text-xs/5 notMobile:max-w-full notMobile:px-3',
              isGridMode
                ? 'mt-3 line-clamp-2 min-h-8 w-full px-2 text-[.625rem]/4 font-medium shortScreen:mt-1 shortScreen:line-clamp-3 shortScreen:px-0'
                : 'mt-4 min-h-10 w-72 mobile:mt-2 mobile:min-h-5',
            )}
          >
            {description}
          </p>
          {subTitle && !isGridMode && (
            <div className="fund-subtitle mx-auto py-1.5 text-xs/3 font-semibold text-tone-350 mobile:mt-3">{subTitle}</div>
          )}
        </div>
      </>
    );
    return hasLink && item.link ? (
      <OutboundLink
        ref={ref as unknown as Ref<HTMLAnchorElement>}
        href={item.link}
        event="portfolio_outbound_click"
        params={{ company_id: companyId, placement: 'portfolio' }}
        onClick={() => onItemClick?.(item)}
        {...shared}
      >
        {content}
      </OutboundLink>
    ) : (
      <div ref={ref} {...shared}>
        {content}
      </div>
    );
  }),
);

PortfolioItem.displayName = 'PortfolioItem';

export default PortfolioItem;
