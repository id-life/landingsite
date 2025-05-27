import { useThree } from '@react-three/fiber';
import { useEffect, useState, useRef } from 'react';
import MobileCenterLogo from './model/vision/MobileCenterLogo';
import MobileDragonModel from './model/vision/MobileDragonModel';
import { useAtomValue } from 'jotai';
import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '../nav/nav';
import gsap from 'gsap';
import { Group } from 'three';

export default function MobileVisionGL() {
  const { viewport } = useThree();
  const [scale, setScale] = useState(1);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const modelRef = useRef<Group>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

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
            duration: 1.2,
            ease: 'power3.out',
          })
          .to(
            modelRef.current.rotation,
            {
              y: 0,
              duration: 1.2,
              ease: 'power2.out',
            },
            '<',
          )
          .to(
            modelRef.current.scale,
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 1,
              ease: 'power2.out',
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
            duration: 1,
            ease: 'power2.in',
          })
          .to(modelRef.current.rotation, { x: -Math.PI / 4, duration: 1, ease: 'power2.in' }, '<')
          .to(modelRef.current, { opacity: 0, duration: 0.5 }, '<');
      }
    }

    // 清理函数
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage.id === NAV_LIST[5].id) {
      gsap.set(modelRef.current, { visible: false });
    } else {
      gsap.set(modelRef.current, { visible: true });
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
