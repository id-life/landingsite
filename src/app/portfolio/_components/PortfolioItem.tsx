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
        // min-height, not height: with the 12 px tagline floor a tile on a tablet grows instead of spilling
        // its one-liner over the next row and the contact chip. At laptop sizes the tiles keep 15.5rem.
        'mobile:flex-center relative w-[23.75rem] pt-3 text-foreground mobile:flex-col mobile:pt-0 notMobile:min-h-[15.5rem]',
        hasLink && 'cursor-pointer',
        isGridMode ? 'mobile:h-full mobile:w-full mobile:justify-center' : 'mobile:h-[30svh] mobile:w-[100dvw]',
        className,
      ),
    };
    const content = (
      <>
        <div
          className={cn(
            'flex items-center justify-center notMobile:px-3 notMobile:[&>img]:max-h-full notMobile:[&>img]:max-w-full notMobile:[&>img]:object-contain',
            isGridMode ? 'h-12 mobile:h-15' : 'h-20 mobile:h-15',
          )}
        >
          {image}
        </div>
        <div className={cn('text-center font-semibold', isGridMode ? 'mt-2 mobile:mt-3' : 'mt-7 mobile:mt-3')}>
          <h3
            className={cn(
              'fund-title flex-center gap-2.5 font-display tracking-normal mobile:whitespace-nowrap notMobile:relative notMobile:min-h-12 notMobile:px-5.5',
              // Type roles (RWD-01): the company name is body-sm on both decks, the one-liner and subtitle caption.
              'text-body-sm',
              isGridMode && 'font-semibold',
            )}
          >
            <img
              src="/svgs/select.svg"
              className="title-selected w-5.5 shrink-0 rotate-180 opacity-0 notMobile:absolute notMobile:left-0"
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
              className="title-selected w-5.5 shrink-0 opacity-0 notMobile:absolute notMobile:right-0"
              alt=""
            />
          </h3>
          {/* The caption role: 12 px up to 1440 px, 13.8 at 1920, on both decks (the phone grid used 10 px, the desktop
              tree 9 px at 1440 and 5.1 px at 820 under the old viewport-scaled root). */}
          <p
            className={cn(
              'fund-desc mx-auto text-caption notMobile:max-w-full notMobile:px-3',
              isGridMode
                ? 'mt-3 line-clamp-3 min-h-8 w-full px-2 font-medium'
                : 'mt-4 min-h-10 w-full max-w-72 mobile:mt-2 mobile:min-h-5',
            )}
          >
            {description}
          </p>
          {subTitle && !isGridMode && (
            <div className="fund-subtitle mx-auto py-1.5 text-caption font-semibold text-tone-350 mobile:mt-3">{subTitle}</div>
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
