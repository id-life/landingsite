import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { DiscoverySVG, PublicationsSVG, SponsorshipSVG, SubscribeBorderSVG } from '@/components/svg';
import { WorldMap } from '@/components/ui/world-map';
import { WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSetAtom } from 'jotai';
import { createElement, FC, memo, SVGProps, useCallback } from 'react';

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);
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
    console.log('publications');
  }, []);
  const onSponsorshipClick = useCallback(() => {
    console.log('sponsorship');
  }, []);
  const onDiscoveryClick = useCallback(() => {
    console.log('discovery');
  }, []);
  return (
    <div id={NAV_LIST[2].id} className="page-container engagement">
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap dots={WORLD_MAP_DOTS} regionDots={WORLD_MAP_REGION_DOTS} />
        <div className="absolute bottom-[9.375rem] left-1/2 z-10 flex -translate-x-1/2 items-center gap-10">
          <EngagementBottomButton
            label="Publications"
            icon={PublicationsSVG}
            onClick={onPublicationsClick}
            iconClassName="w-5.5"
          />
          <EngagementBottomButton label="Sponsorship" icon={SponsorshipSVG} onClick={onSponsorshipClick} />
          <EngagementBottomButton label="Discovery" icon={DiscoverySVG} onClick={onDiscoveryClick} />
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
}: {
  label: string;
  icon: FC<SVGProps<SVGElement>>;
  onClick: () => void;
  iconClassName?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative flex h-[3.125rem] w-[13rem] cursor-pointer items-center justify-center gap-1.5 bg-white/10 text-base/5 font-semibold text-foreground backdrop-blur-2xl transition-colors duration-150 hover:text-red-600"
    >
      <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground transition-colors duration-150 group-hover:stroke-red-600" />
      {createElement(icon, {
        className: cn('h-7.5 w-6 fill-foreground transition-colors duration-150 group-hover:fill-red-600', iconClassName),
      })}
      {label}
    </div>
  );
});
EngagementBottomButton.displayName = 'EngagementBottomButton';
