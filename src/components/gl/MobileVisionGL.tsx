import { mobileCurrentPageAtom } from '@/atoms';
import { useLoader, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { Group } from 'three';
import { SVGLoader } from 'three-stdlib';
import { NAV_LIST } from '../nav/nav';
import MobileCenterLogo from './model/vision/MobileCenterLogo';
import MobileDragonModel from './model/vision/MobileDragonModel';
import { fitHeroScale, PHONE_LOGO, svgInkSize } from './model/vision/heroFit';
import { DURATION, EASE } from '@/motion/tokens';

export default function MobileVisionGL() {
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
        <MobileCenterLogo />
        <MobileDragonModel />
      </group>
    </group>
  );
}
