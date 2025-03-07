import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSetAtom } from 'jotai';
import { memo } from 'react';
// import Demo4 from './Demo4/Demo4';
import { WorldMap } from '@/components/ui/world-map';

// import Demo4 from './Demo4/Demo4';

const WORLD_MAP_DOTS = [
  {
    start: {
      lat: 64.2008,
      lng: -149.4937,
    }, // Alaska (Fairbanks)
    end: {
      lat: 34.0522,
      lng: -118.2437,
    }, // Los Angeles
  },
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
];

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
  return (
    <div id={NAV_LIST[2].id} className="page-container engagement">
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap dots={WORLD_MAP_DOTS} lineColor="#0ea5e9" />
      </div>
      {/* <div className="relative flex h-[100svh] flex-col items-center justify-center"> */}
      {/*<Demo9 />*/}
      {/* <Demo8 /> */}
      {/*<Demo3 />*/}
      {/*<div className="absolute left-0 top-0 flex w-[300vw] flex-nowrap">*/}
      {/*<div className="test-panel h-screen w-screen">*/}
      {/*  <Demo3 />*/}
      {/*</div>*/}
      {/*<div className="test-panel h-40 w-screen">*/}
      {/*  <video src="https://cdn.id.life/video/translation-01.webm" autoPlay loop muted />*/}
      {/*</div>*/}
      {/*<div className="test-panel h-screen w-screen">*/}
      {/*  <Demo4 />*/}
      {/*</div>*/}
      {/*</div>*/}
      {/* <div className="relative left-40 z-10 grid grid-cols-3 gap-15 text-white">
          <div>
            <div className="text-3xl font-semibold uppercase">talk</div>
            <div className="mt-1.5 text-base font-medium">
              <p>2024 Oxford Future Innovation Forum - Healthy Aging sub-forum</p>
              <p>Timepie</p>
              <p>Edge City Lanna</p>
              <p>Founder&apos;s Longevity Forum</p>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold uppercase">translation & publishing</div>
            <div className="mt-1.5 text-base font-medium">
              <p>bio/acc manifesto &gt;</p>
              <p>the Network State &gt;</p>
              <p>The Case against death</p>
              <p>王钊 better aging</p>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold uppercase">sponsorship</div>
            <div className="">
              <div className="mt-2.5 flex gap-5">
                <img className="h-10 w-36" src="/imgs/engagement/sponsor-01.webp" alt="" />
                <img className="w-33" src="/imgs/engagement/sponsor-02.webp" alt="" />
              </div>
              <div className="mt-2.5 flex items-center gap-5">
                <img className="h-9 w-45" src="/imgs/engagement/sponsor-03.webp" alt="" />
                <img className="w-16.5" src="/imgs/engagement/sponsor-04.webp" alt="" />
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default memo(Engagement);
