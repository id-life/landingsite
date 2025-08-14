import { currentPageAtom, currentPageIndexAtom, innerPageIndexAtom, innerPageNavigateToAtom } from '@/atoms';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { useValueCrossAnimations } from '@/hooks/valueGL/useValueCrossAnimations';
import { useValueShowEvent } from '@/hooks/valueGL/useValueShowEvent';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, RefObject, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

type TitleProps = {
  titleRef: RefObject<THREE.Group>;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  scale: number;
  titleName: string;
};
const TitleSVG = memo(({ titleRef, position, rotation, scale, titleName }: TitleProps) => (
  <Center ref={titleRef} position={position} rotation={rotation}>
    <Svg scale={scale} name={`${titleName}-svg`} src={`/svgs/value/${titleName}.svg`} />
    <Svg scale={scale} name={`${titleName}-cn-svg`} src={`/svgs/value/${titleName}-cn.svg`} />
  </Center>
));

TitleSVG.displayName = 'TitleSVG';

function ValueGL() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const { sendValueShowEvent } = useValueShowEvent();

  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const isScrollingRef = useRef(false);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const { createPage1CrossAnim, createPage2CrossAnim, createPage3CrossAnim, createPage4CrossAnim, createPage5CrossAnim } =
    useValueCrossAnimations({ modelRef });

  useGSAP(
    () => {
      const tl1 = gsap.timeline({
        scrollTrigger: {
          id: 'value-page1-scroll-trigger',
          trigger: `#value-page1`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            setCurrentPage(NAV_LIST[5]);
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl1.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 2.5,
              scrollTop: tl1.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
          onEnterBack: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother) return;
            const twinST = ScrollTrigger.getById('twin-scroll-trigger');
            smoother.paused(true);
            const twinShow = twinST?.labelToScroll('twin-show');
            gsap.to(smoother, {
              scrollTop: twinShow,
              duration: 3,
              ease: 'none',
              onComplete: () => {
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
        },
      });
      createPage1CrossAnim(tl1);

      const tl2 = gsap.timeline({
        scrollTrigger: {
          id: 'value-page2-scroll-trigger',
          trigger: `#value-page2`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl2.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 1.5,
              scrollTop: tl2.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                setTimeout(() => smoother.paused(false), 300);
                if (!isScrollingRef.current) setInnerPageIndex(1);
              },
            });
          },
          onEnterBack: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl2.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 1.5,
              scrollTop: tl2.scrollTrigger.start - 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(0);
                  sendValueShowEvent(0, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
        },
      });
      createPage2CrossAnim(tl2);

      const tl3 = gsap.timeline({
        scrollTrigger: {
          id: 'value-page3-scroll-trigger',
          trigger: `#value-page3`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl3.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 1.5,
              scrollTop: tl3.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(2);
                  sendValueShowEvent(2, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
          onEnterBack: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl3.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 1.5,
              scrollTop: tl3.scrollTrigger.start - 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  sendValueShowEvent(1, 'scroll');
                  setInnerPageIndex(1);
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
        },
      });
      createPage3CrossAnim(tl3);

      const tl4 = gsap.timeline({
        scrollTrigger: {
          id: 'value-page4-scroll-trigger',
          trigger: `#value-page4`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl4.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 2,
              scrollTop: tl4.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(3);
                  sendValueShowEvent(3, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
          onEnterBack: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl4.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 2,
              scrollTop: tl4.scrollTrigger.start - 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(2);
                  sendValueShowEvent(2, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
        },
      });
      createPage4CrossAnim(tl4);

      const tl5 = gsap.timeline({
        scrollTrigger: {
          id: 'value-page5-scroll-trigger',
          trigger: `#value-page5`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl5.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 2,
              scrollTop: tl5.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(4);
                  sendValueShowEvent(4, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
          onEnterBack: () => {
            if (window.isNavScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl5.scrollTrigger) return;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 2,
              scrollTop: tl5.scrollTrigger.start - 50,
              ease: 'none',
              onComplete: () => {
                if (!isScrollingRef.current) {
                  setInnerPageIndex(3);
                  sendValueShowEvent(3, 'scroll');
                }
                setTimeout(() => smoother.paused(false), 300);
              },
            });
          },
        },
      });
      createPage5CrossAnim(tl5);
    },
    { dependencies: [] },
  );
  useEffect(() => {
    if (currentPageIndex !== VALUE_PAGE_INDEX || innerPageNavigateTo === null) return;
    const st = ScrollTrigger.getById(`value-page${innerPageNavigateTo + 1}-scroll-trigger`);
    if (st) {
      isScrollingRef.current = true;
      gsap.to(window, {
        duration: 1,
        scrollTo: st.end,
        onComplete: () => {
          isScrollingRef.current = false;
          enableScroll();
        },
      });
    }
    setInnerPageIndex(innerPageNavigateTo);
    setInnerPageNavigateTo(null);
  }, [currentPageIndex, innerPageNavigateTo, setInnerPageIndex, setInnerPageNavigateTo, enableScroll]);

  return (
    <group position={[0, -10, 0]}>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(ValueGL);
