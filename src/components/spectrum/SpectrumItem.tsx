import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { cloneElement, forwardRef, HTMLAttributes, memo, useCallback, useMemo } from 'react';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  className?: string;
  isHover?: boolean;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
}

const SpectrumLink = memo(({ item }: { item: SpectrumLinkItem }) => {
  const { trackEvent } = useGA();

  const { label, link, isComingSoon, onClick, labelClassName } = item;
  const hasLink = Boolean(link || onClick);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasLink) return;

      trackEvent({
        name: GA_EVENT_NAMES.SPECTRUM_CLICK,
        label,
      });

      onClick?.();
      if (link) window.open(link, '_blank');
    },
    [hasLink, trackEvent, label, onClick, link],
  );

  return (
    <div className="relative flex items-center gap-1">
      <a href={link} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        <p
          className={cn(
            'spectrum-link-text group relative font-poppins text-xs/5 font-medium capitalize',
            hasLink &&
              'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
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
});

SpectrumLink.displayName = 'SpectrumLink';

const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(({ item, onClick, className, isHover }, ref) => {
    const { title, titleCn, icon, links, className: itemClassName } = item;

    const { trackEvent } = useGA();

    const onMouseEnter = () => {
      trackEvent({
        name: GA_EVENT_NAMES.SPECTRUM_HOVER,
        label: title,
      });
    };

    const spectrumLinks = useMemo(() => {
      return links?.map((item) => <SpectrumLink key={item.label} item={item} />);
    }, [links]);

    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
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
            <div className="mt-5 flex flex-col">{spectrumLinks}</div>
          </div>
        </div>
      </div>
    );
  }),
);

SpectrumItem.displayName = 'SpectrumItem';

export default SpectrumItem;
