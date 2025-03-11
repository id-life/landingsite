import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { DiscoverySVG, PublicationsSVG, SponsorshipSVG, SubscribeBorderSVG } from '@/components/svg';
import { EngagementPopup } from '@/components/engagement/EngagementPopup';
import { WorldMap } from '@/components/engagement/WorldMap';
import { engagementBottomButtons, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSetAtom } from 'jotai';
import { createElement, FC, memo, SVGProps, useCallback, useState } from 'react';

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [activePopup, setActivePopup] = useState<'publications' | 'sponsorship' | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
        },
      },
    });
    // tl.to('.test-panel', { xPercent: -100, ease: 'none' });
  }, []);

  const onPublicationsClick = useCallback(() => {
    setActivePopup((prev) => (prev === 'publications' ? null : 'publications'));
  }, []);

  const onSponsorshipClick = useCallback(() => {
    setActivePopup((prev) => (prev === 'sponsorship' ? null : 'sponsorship'));
  }, []);

  const onDiscoveryClick = useCallback(() => {
    console.log('discovery');
  }, []);

  return (
    <div id={NAV_LIST[2].id} className="page-container engagement">
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap dots={WORLD_MAP_DOTS} regionDots={WORLD_MAP_REGION_DOTS} />
        <div className="absolute bottom-[9.375rem] left-1/2 z-10 flex -translate-x-1/2 items-center gap-x-9 gap-y-0">
          <div className="relative">
            <EngagementBottomButton
              label="Publications"
              icon={PublicationsSVG}
              onClick={onPublicationsClick}
              iconClassName="w-5.5"
              active={activePopup === 'publications'}
            />
            <EngagementPopup
              isOpen={activePopup === 'publications'}
              title={engagementBottomButtons.publications.title}
              items={engagementBottomButtons.publications.items}
              className="h-[17.5rem]"
            />
          </div>

          <div className="relative">
            <EngagementBottomButton
              label="Sponsorship"
              icon={SponsorshipSVG}
              onClick={onSponsorshipClick}
              active={activePopup === 'sponsorship'}
            />
            <EngagementPopup
              isOpen={activePopup === 'sponsorship'}
              title={engagementBottomButtons.sponsorship.title}
              items={engagementBottomButtons.sponsorship.items}
              className="h-[17.875rem] w-[13rem]"
            />
          </div>

          <div className="relative">
            <EngagementBottomButton label="Discovery" icon={DiscoverySVG} onClick={onDiscoveryClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Engagement);

const EngagementBottomButton = memo(function EngagementBottomButton({
  label,
  icon,
  onClick,
  iconClassName,
  active,
}: {
  label: string;
  icon: FC<SVGProps<SVGElement>>;
  onClick: () => void;
  iconClassName?: string;
  active?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex h-[3.125rem] w-[13rem] cursor-pointer items-center justify-center gap-1.5 bg-white/10 text-base/5 font-semibold backdrop-blur-2xl transition-colors duration-150',
        active ? 'text-red-600' : 'text-foreground hover:text-red-600',
      )}
    >
      <SubscribeBorderSVG
        className={cn(
          'absolute left-0 top-0 size-full transition-colors duration-150',
          active ? 'stroke-red-600' : 'stroke-foreground group-hover:stroke-red-600',
        )}
      />
      {createElement(icon, {
        className: cn(
          'h-7.5 w-6 transition-colors duration-150',
          active ? 'fill-red-600' : 'fill-foreground group-hover:fill-red-600',
          iconClassName,
        ),
      })}
      {label}
    </div>
  );
});
EngagementBottomButton.displayName = 'EngagementBottomButton';
