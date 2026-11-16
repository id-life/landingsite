'use client';

import { useThree, useLoader } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';
import gsap from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import * as THREE from 'three';
import { Group } from 'three';
import { useGSAP } from '@gsap/react';
import { useLogoTextures } from '@/hooks/useLogoTextures';
import { fitHeroScale, fitHeroToReserve, LOGO_PLANE_HEIGHT, PHONE_LOGO, svgInkSize } from './model/vision/heroFit';
import { heroStatementBoxAtom } from './model/vision/heroReserve';
import { mobileCurrentPageAtom } from '@/atoms';
import { useAtomValue } from 'jotai';
import { SVGLoader } from 'three-stdlib';
import { DURATION, EASE } from '@/motion/tokens';

function DesktopVisionGL() {
  const size = useThree((state) => state.size);
  const { logoEnAspectRatio } = useLogoTextures();
  const modelRef = useRef<THREE.Group>(null);

  const statement = useAtomValue(heroStatementBoxAtom);
  // The wordmark (and the dragon with it) fits the frustum with a clear margin on every screen, and moves down (or,
  // on short windows, also shrinks) so the ring and the dragon stay clear of the home statement at rest.
  const { scale, offsetY } = useMemo(
    () => fitHeroToReserve(size.width, size.height, LOGO_PLANE_HEIGHT * logoEnAspectRatio, LOGO_PLANE_HEIGHT, statement),
    [size.width, size.height, logoEnAspectRatio, statement],
  );

  useGSAP(() => {
    // in connect page, hide dragon model
    gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[6].id}`,
        scrub: true,
        onEnter: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: false });
        },
        onLeaveBack: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: true });
        },
      },
    });
  }, []);

  return (
    <group position={[0, offsetY, 0]}>
      <group ref={modelRef} scale={scale}>
        <CenterLogo deck="desktop" />
        <DragonModel deck="desktop" />
      </group>
    </group>
  );
}

function PhoneVisionGL() {
  const size = useThree((state) => state.size);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const modelRef = useRef<Group>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Same frustum fit as the desktop tree, measured on the wordmark SVG MobileCenterLogo draws (the
  // loader cache returns the file it already loaded).
  const logoSvg = useLoader(SVGLoader, PHONE_LOGO.url);
  const logoInk = useMemo(() => svgInkSize(logoSvg), [logoSvg]);
  const scale = useMemo(
    () => fitHeroScale(size.width / size.height, logoInk.width * PHONE_LOGO.scale, logoInk.height * PHONE_LOGO.scale),
    [size.width, size.height, logoInk],
  );

  useEffect(() => {
    if (currentPage.id === NAV_LIST[0].id) {
      // 如果存在正在执行的动画，先清除
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // 创建新的动画时间线
      timelineRef.current = gsap.timeline();

      // 入场动画
      if (modelRef.current) {
        // 设置初始状态
        modelRef.current.position.set(0, 0, 8);
        modelRef.current.rotation.set(0, Math.PI / 2, 0);
        modelRef.current.scale.set(0.8, 0.8, 0.8);

        timelineRef.current
          .to(modelRef.current.position, {
            z: 0,
            duration: DURATION.camera,
            ease: EASE.out,
          })
          .to(
            modelRef.current.rotation,
            {
              y: 0,
              duration: DURATION.camera,
              ease: EASE.out,
            },
            '<',
          )
          .to(
            modelRef.current.scale,
            {
              x: 1,
              y: 1,
              z: 1,
              duration: DURATION.camera,
              ease: EASE.out,
            },
            '<0.1',
          );
      }
    } else {
      // 如果存在正在执行的动画，先清除
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // 创建新的动画时间线
      timelineRef.current = gsap.timeline();

      // 出场动画
      if (modelRef.current) {
        timelineRef.current
          .to(modelRef.current.position, {
            y: 10,
            z: 10,
            duration: DURATION.camera,
            ease: EASE.in,
          })
          // (A Group has no opacity: the old opacity tween here only made GSAP warn, MOT-14.)
          .to(modelRef.current.rotation, { x: -Math.PI / 4, duration: DURATION.camera, ease: EASE.in }, '<');
      }
    }

    // 清理函数
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentPage]);

  // 只在 Vision 页面显示模型，其他页面立即隐藏
  useEffect(() => {
    if (!modelRef.current) return;
    if (currentPage.id === NAV_LIST[0].id) {
      modelRef.current.visible = true;
    } else {
      modelRef.current.visible = false;
    }
  }, [currentPage]);

  return (
    <group scale={scale}>
      <group ref={modelRef}>
        <CenterLogo deck="phone" />
        <DragonModel deck="phone" />
      </group>
    </group>
  );
}

/**
 * The hero scene (wordmark and dragon), one component for both decks (RWD-02; it was VisionGL and MobileVisionGL). By
 * deck: the desktop deck fits the wordmark from its texture aspect and hides the dragon on Connect through
 * ScrollTrigger; the phone deck fits from the SVG ink and runs an enter / exit timeline per section.
 */
export default function VisionGL({ deck }: { deck: 'desktop' | 'phone' }) {
  return deck === 'phone' ? <PhoneVisionGL /> : <DesktopVisionGL />;
}
