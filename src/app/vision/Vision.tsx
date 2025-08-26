import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const currentPage = useAtomValue(currentPageAtom);
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    scrollFn: () => {
      if (!enableDownJudge || window.isNavScrolling) return;
      // console.log('vision scrollFn Down');
      const st = ScrollTrigger.getById('portfolio-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      gsap.to(window, {
        duration: 2,
        scrollTo: { y: st.start + (st.end - st.start) * 0.95 },
        onComplete: () => {
          window.isNavScrolling = false;
        },
        ease: 'power4.inOut',
      });
    },
    isUp: false,
  });

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: `#${NAV_LIST[0].id}`,
        start: 'top bottom',
        endTrigger: `#${NAV_LIST[1].id}`,
        end: 'top top',
        id: 'vision-trigger',
        onEnter: () => {
          console.log('vision onEnter');
          setEnableDownJudge(true);
        },
        onLeave: () => {
          console.log('vision onLeave');
          setEnableDownJudge(false);
        },
        onEnterBack: () => {
          console.log('vision onEnterBack');
          setEnableDownJudge(false);
        },
        onLeaveBack: () => {
          console.log('vision onLeaveBack');
          setEnableDownJudge(false);
        },
      });
    },

    { scope: wrapperRef },
  );

  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage.id === NAV_LIST[0].id) {
      console.log('vision setEnableDownJudge true');
      setEnableDownJudge(true);
    } else {
      setEnableDownJudge(false);
    }
  }, [currentPage, globalLoaded, setEnableDownJudge]);

  return (
    <div ref={wrapperRef} id={NAV_LIST[0].id} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
