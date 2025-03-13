import { currentPageAtom, currentPageIndexAtom, innerPageIndexAtom, innerPageNavigateToAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { EngagementPopup } from '@/components/engagement/EngagementPopup';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { DiscoverySVG, PublicationsSVG, SponsorshipSVG, SubscribeBorderSVG } from '@/components/svg';
import { engagementBottomButtons, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { debounce } from 'lodash-es';
import { createElement, FC, memo, SVGProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEngagementJumpTo } from '@/hooks/engegement/useEngagementJumpTo';

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [activePopup, setActivePopup] = useState<'publications' | 'sponsorship' | null>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const lastIndexRef = useRef<number>(0);
  const { jumpTo } = useEngagementJumpTo();

  const debouncedSetInnerPageIndex = useMemo(
    () =>
      debounce((index: number) => {
        if (lastIndexRef.current !== index) {
          lastIndexRef.current = index;
          setInnerPageIndex(index);
        }
      }, 200),
    [setInnerPageIndex],
  );

  useGSAP(() => {
    if (!globalLoaded) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
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
        // onUpdate: (p) => {
        //   console.log('progress:', p);
        // },
      },
    });
    tl.set('#world-map-img', { y: 50, opacity: 0 });
    tl.set(['.world-map-region', '.world-map-dot'], {
      opacity: 0,
    });
    const buttons = document.querySelectorAll('.engagement-bottom-button');
    tl.set(buttons, { y: 30, opacity: 0 });

    // 使用进度位置控制动画时机
    // 入场动画：0 - 0.4
    // 停留时间：0.4 - 0.65
    // 出场动画：0.65 - 1.0
    const factor = 100; // 动画因子

    // 计算入场动画总时长（占总进度的0.4
    const entranceDuration = 0.4 * factor;
    // 计算入场每个动画的单位时长
    const entranceUnit = entranceDuration / 4; // 分为 4 个步骤

    // 入场动画序列
    tl.to(
      '#world-map-img',
      {
        y: 0,
        opacity: 1,
        ease: 'none',
        duration: entranceUnit,
      },
      0,
    );

    tl.to(
      '.world-map-region',
      {
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        stagger: entranceUnit * 0.2,
        duration: entranceUnit,
      },
      entranceUnit,
    );

    tl.to(
      '.world-map-dot',
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        duration: entranceUnit,
      },
      entranceUnit * 2,
    );

    tl.to(
      buttons,
      {
        y: 0,
        opacity: 1,
        stagger: entranceUnit * 0.2,
        ease: 'back.out(1.7)',
        duration: entranceUnit,
      },
      entranceUnit * 3,
    );

    // 停留 0.4 - 0.8
    const stayDuration = 0.4 * factor;
    // 计算停留每个动画的单位时长
    const stayUnit = stayDuration / 4; // 分为 4 个步骤
    tl.to(`.world-map-dot-content-0`, { opacity: 1, height: '70vh', ease: 'power2.out', duration: stayUnit / 2 }, 0.4 * factor);
    tl.to(
      `.world-map-dot-content-0`,
      { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
      0.4 * factor + stayUnit,
    );
    tl.to(
      `.world-map-dot-content-1`,
      {
        opacity: 1,
        height: '70vh',
        ease: 'power2.out',
        duration: stayUnit / 2,
        onComplete: () => {
          debouncedSetInnerPageIndex(1);
        },
        onReverseComplete: () => {
          debouncedSetInnerPageIndex(0);
        },
      },
      '<',
    );
    tl.to(
      `.world-map-dot-content-1`,
      { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
      0.4 * factor + stayUnit * 2,
    );
    tl.to(
      `.world-map-dot-content-2`,
      {
        opacity: 1,
        height: '70vh',
        ease: 'power2.out',
        duration: stayUnit / 2,
        onComplete: () => {
          debouncedSetInnerPageIndex(2);
        },
        onReverseComplete: () => {
          debouncedSetInnerPageIndex(1);
        },
      },
      '<',
    );
    tl.to(
      `.world-map-dot-content-2`,
      { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
      0.4 * factor + stayUnit * 3,
    );
    tl.to(
      `.world-map-dot-content-3`,
      {
        opacity: 1,
        height: '70vh',
        ease: 'power2.out',
        duration: stayUnit / 2,
        onComplete: () => {
          debouncedSetInnerPageIndex(3);
        },
        onReverseComplete: () => {
          debouncedSetInnerPageIndex(2);
        },
      },
      '<',
    );
    // 出场动画（在进度0.8后开始）
    // 计算出场动画总时长（占总进度的0.2）
    const exitDuration = 0.2 * factor;
    // 计算出场每个动画的单位时长
    const exitUnit = exitDuration / 3; // 分为2个步骤

    // 出场动画序列
    tl.to(`.world-map-dot-content-3`, { opacity: 0, height: 0, ease: 'power2.out', duration: exitUnit }, 0.8 * factor);
    tl.to(
      buttons,
      {
        y: 30,
        opacity: 0,
        stagger: exitUnit * 0.2,
        ease: 'back.out(1.7)',
        duration: exitUnit,
      },
      0.8 * factor + exitUnit,
    );
    tl.to(
      ['#world-map-img', '#world-map-svg'],
      {
        y: -50,
        opacity: 0,
        ease: 'power2.out',
        duration: exitUnit,
      },
      0.8 * factor + exitUnit * 2,
    );
  }, [globalLoaded, debouncedSetInnerPageIndex]);

  useEffect(() => {
    if (currentPageIndex !== 2 || innerPageNavigateTo === null) return;
    jumpTo(innerPageNavigateTo, () => {
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    });
  }, [currentPageIndex, innerPageNavigateTo, jumpTo, setInnerPageIndex, setInnerPageNavigateTo]);

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
        <div className="engagement-bottom-buttons-container absolute bottom-[9.375rem] left-1/2 z-10 flex -translate-x-1/2 items-center gap-x-9 gap-y-0">
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
        'engagement-bottom-button opacity-0', // anim init
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
