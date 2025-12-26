import { currentPageAtom, currentPageIndexAtom, innerPageIndexAtom, innerPageNavigateToAtom } from '@/atoms';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { useConnectCrossAnimations } from '@/hooks/connectGL/useConnectCrossAnimations';
import { useConnectShowEvent } from '@/hooks/connectGL/useConnectShowEvent';
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

function ConnectGL() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const { sendValueShowEvent } = useConnectShowEvent();

  const currentPage = useAtomValue(currentPageAtom);
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const isScrollingRef = useRef(false);
  const footerAnimDelayRef = useRef<gsap.core.Tween | null>(null);
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const { createPage1CrossAnim, playFooterEnterAnim, playFooterLeaveAnim } = useConnectCrossAnimations({ modelRef });

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // connect auto scroll to insights
    scrollFn: () => {
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('insights-scroll-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.SLOW / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.5 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: true,
  });

  useGSAP(
    () => {
      const tl1 = gsap.timeline({
        scrollTrigger: {
          id: 'connect-page1-scroll-trigger',
          trigger: `#connect-page1`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (window.isResizing) return;
            console.log('[ConnectGL] onEnter - 进入Connect页面');
            setCurrentPage(NAV_LIST[6]);
            setEnableUpJudge(true);
            if (window.isNavScrolling || window.isSmootherScrolling) return;
            const smoother = ScrollSmoother.get();
            if (!smoother || !tl1.scrollTrigger) return;
            window.isNavScrolling = true;
            window.isSmootherScrolling = true;
            smoother.paused(true);
            gsap.to(smoother, {
              duration: 3,
              scrollTop: tl1.scrollTrigger.end + 50,
              ease: 'none',
              onComplete: () => {
                smoother.paused(false);
                window.isNavScrolling = false;
                window.isSmootherScrolling = false;
              },
            });
          },
          onEnterBack: () => {
            if (window.isResizing) return;
            console.log('[ConnectGL] onEnterBack - 取消延迟调用并隐藏footer');
            // 取消之前的延迟调用
            if (footerAnimDelayRef.current) {
              footerAnimDelayRef.current.kill();
              footerAnimDelayRef.current = null;
            }
            setEnableUpJudge(true);
            playFooterLeaveAnim();
          },
          onLeave: () => {
            if (window.isResizing) return;
            setEnableUpJudge(false);
            console.log('[ConnectGL] onLeave - 显示footer', { isNavScrolling: window.isNavScrolling });
            // 取消之前的延迟调用
            if (footerAnimDelayRef.current) {
              footerAnimDelayRef.current.kill();
              footerAnimDelayRef.current = null;
            }
            if (window.isNavScrolling) {
              // 通过菜单导航进入，延迟1秒播放EN→CN动画
              footerAnimDelayRef.current = gsap.delayedCall(1, () => {
                // 检查是否还在Connect页面，如果不在就不执行动画
                const pageId = currentPageRef.current?.id;
                console.log('[ConnectGL] 延迟调用执行', { currentPageId: pageId });
                if (pageId === 'connect_page') {
                  console.log('[ConnectGL] 确认在Connect页面 - 显示footer');
                  playFooterEnterAnim();
                } else {
                  console.log('[ConnectGL] 已离开Connect页面 - 取消footer动画');
                }
                footerAnimDelayRef.current = null;
              });
            } else {
              // 正常滚动，立即播放
              playFooterEnterAnim();
            }
          },
          onLeaveBack: () => {
            if (window.isResizing) return;
            console.log('[ConnectGL] onLeaveBack - 取消延迟调用并隐藏footer');
            // 取消之前的延迟调用
            if (footerAnimDelayRef.current) {
              footerAnimDelayRef.current.kill();
              footerAnimDelayRef.current = null;
            }
            setEnableUpJudge(false);
            playFooterLeaveAnim();
          },
        },
      });
      createPage1CrossAnim(tl1);
    },
    { dependencies: [] },
  );
  useEffect(() => {
    if (currentPageIndex !== CONNECT_PAGE_INDEX || innerPageNavigateTo === null) return;
    const st = ScrollTrigger.getById(`connect-page${innerPageNavigateTo + 1}-scroll-trigger`);
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

export default memo(ConnectGL);
