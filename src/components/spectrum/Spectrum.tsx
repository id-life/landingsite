'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { beats, DISTANCE, MAX_TILT } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { memo, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import SpectrumItem from './SpectrumItem';

const PAGE_ID = 'spectrum_page';
const spectrumNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

function Spectrum() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(1);

  const { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const initiativeItems = spectrumData.slice(0, 3);
  const publicationItem = spectrumData[3];
  const sponsorItem = spectrumData[spectrumData.length - 1];

  const selectInitiative = (index: number) => {
    setImageIdx(index + 1);
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      // Scrubbed: lengths are beats (shares of the section's scroll), not seconds.
      defaults: { duration: beats(0.5) },
      scrollTrigger: {
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        // markers: true,
        id: 'spectrum-trigger', // add an ID for later reference
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onLeaveBack: () => {
          if (isLayoutRefreshing()) return;
          setActive(false);
        },
      },
    });
    // Entrances rise 16-24 px with a tilt of at most 8 degrees (MOT-08; they tilted 45 and 15 degrees).
    tl.from('.spectrum-title', { delay: beats(1), y: DISTANCE.md, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 });
    tl.from('.spectrum-fund', { y: DISTANCE.sm, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 });

    // Every arrival lands here (MOT-01), then a short hold inside the pin.
    tl.addLabel('rest');
    tl.to({}, { duration: beats(0.25) });
  }, []);

  return (
    <div id={PAGE_ID} className="page-container spectrum">
      <ParticleGL
        isStatic
        activeAnim={active}
        imageIdx={imageIdx}
        id="spectrum-particle-container"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col overflow-y-auto px-10 pb-20 pt-28 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_51%_52%,rgba(138,168,181,0.07),transparent_30%),linear-gradient(125deg,rgba(117,11,19,0.12),transparent_22%)]" />
        <div className="spectrum-title relative z-10 pb-5 text-center">
          <h2 className="font-title text-[2.75rem]/none uppercase text-white">Spectrum</h2>
        </div>
        <div id="spectrum-particle-gl" className="pointer-events-none opacity-30">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}></div>
        </div>
        <div className="spectrum-fund relative z-10 mx-auto mt-2 flex w-full max-w-[1400px] flex-1 flex-col py-3">
          <div className="flex flex-1 flex-col justify-evenly gap-6">
            <SpectrumInitiatives
              items={initiativeItems}
              onSelect={selectInitiative}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
            <SpectrumInitiatives
              items={[publicationItem]}
              layout="publications"
              onSelect={() => selectInitiative(3)}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
            <div className="w-full pb-4 pt-2">
              <SpectrumItem
                key={sponsorItem.title}
                item={sponsorItem}
                isSponsor
                className="!p-0"
                executeSpectrumRoute={executeSpectrumRoute}
                updateUrlAndExecute={updateUrlAndExecute}
                routeConfigs={routeConfigs}
                onClick={(e) => {
                  sponsorItem.onClick?.(e);
                }}
                onHover={() => setImageIdx(5)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
