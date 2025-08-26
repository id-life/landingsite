'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function Value() {
  const currentPage = useAtomValue(currentPageAtom);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // value auto scroll to twin
    scrollFn: () => {
      // console.log('[Value] scrollFn UP called - enableUpJudge:', enableUpJudge, 'isNavScrolling:', window.isNavScrolling);
      if (!enableUpJudge || currentPage.id !== NAV_LIST[5].id || window.isNavScrolling) return;
      const st = ScrollTrigger.getById('twin-scroll-trigger');
      if (!st) return;
      // console.log('[Value] Starting auto-scroll to Twin');
      window.isNavScrolling = true;
      gsap.to(window, {
        duration: 3,
        scrollTo: { y: st.start + (st.end - st.start) * 0.5 },
        onComplete: () => {
          window.isNavScrolling = false;
          // console.log('[Value] Auto-scroll UP completed');
        },
      });
    },
    isUp: true,
  });

  useEffect(() => {
    if (currentPage.id === NAV_LIST[5].id) {
      console.log('value setEnableUpJudge true');
      setEnableUpJudge(true);
    } else {
      setEnableUpJudge(false);
    }
  }, [currentPage, setEnableUpJudge]);

  return (
    <div id={NAV_LIST[5].id} className="page-container value">
      <div id="value-page1" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page2" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page3" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page4" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page5" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
    </div>
  );
}
