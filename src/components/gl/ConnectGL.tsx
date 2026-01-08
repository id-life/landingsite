import { currentPageAtom } from '@/atoms';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { useConnectCrossAnimations } from '@/hooks/connectGL/useConnectCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, RefObject, useRef } from 'react';
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

  const currentPage = useAtomValue(currentPageAtom);
  const footerAnimDelayRef = useRef<gsap.core.Tween | null>(null);
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const { createPage1CrossAnim, playFooterEnterAnim, playFooterLeaveAnim, playEnToCnAnim } = useConnectCrossAnimations({
    modelRef,
  });

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // connect auto scroll to twin
    scrollFn: () => {
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('twin-scroll-trigger');
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
            // 立即显示底栏
            playFooterEnterAnim();
            // 取消之前的延迟调用
            if (footerAnimDelayRef.current) {
              footerAnimDelayRef.current.kill();
              footerAnimDelayRef.current = null;
            }
            // 延迟1秒后播放 EN→CN 动画，让英文有时间停留
            footerAnimDelayRef.current = gsap.delayedCall(1, () => {
              const pageId = currentPageRef.current?.id;
              if (pageId === 'connect_page') {
                playEnToCnAnim();
              }
              footerAnimDelayRef.current = null;
            });
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
            // 立即显示底栏
            playFooterEnterAnim();
            // 取消之前的延迟调用
            if (footerAnimDelayRef.current) {
              footerAnimDelayRef.current.kill();
              footerAnimDelayRef.current = null;
            }
            // 延迟1秒后播放 EN→CN 动画，让英文有时间停留
            footerAnimDelayRef.current = gsap.delayedCall(1, () => {
              const pageId = currentPageRef.current?.id;
              console.log('[ConnectGL] 延迟调用执行', { currentPageId: pageId });
              if (pageId === 'connect_page') {
                console.log('[ConnectGL] 确认在Connect页面 - 播放EN→CN动画');
                playEnToCnAnim();
              } else {
                console.log('[ConnectGL] 已离开Connect页面 - 取消EN→CN动画');
              }
              footerAnimDelayRef.current = null;
            });
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

  return (
    <group position={[0, -10, 0]}>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(ConnectGL);
