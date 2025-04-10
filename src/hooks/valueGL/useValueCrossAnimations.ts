import { innerPageIndexAtom } from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group, Vector3 } from 'three';
import gsap from 'gsap';

export const centerPoint = new Vector3(0, -10, 0);

export const useValueCrossAnimations = ({
  modelRef,
  isScrollingRef,
}: {
  modelRef: React.RefObject<Group>;
  isScrollingRef: React.RefObject<boolean>;
}) => {
  const { camera } = useThree();
  const page2Config = useMemo(() => VALUE_GL_CONFIG[1], []);
  const page3Config = useMemo(() => VALUE_GL_CONFIG[2], []);

  const setValuePageIndex = useSetAtom(innerPageIndexAtom);

  // page cross anim
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    const title1 = gsap.utils.toArray('.value-title1 path');
    const title1cn = gsap.utils.toArray('.value-title1cn path');
    const title2 = gsap.utils.toArray('.value-title2 path');
    const title2cn = gsap.utils.toArray('.value-title2cn path');
    title1.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title2.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title1cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    title2cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    tl.to('#fixed-value-page-1', {
      rotationX: 60,
      rotationZ: 60,
      z: 100,
      opacity: 0,
      ease: 'power3.inOut',
      transformOrigin: '100% 0%',
      duration: 6,
    });
    tl.to(
      camera.position,
      {
        ...page2Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      camera.rotation,
      {
        ...page2Config.to.camera.rotation,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(0);
        },
      },
      '<',
    );
    tl.fromTo(
      '#fixed-value-page-2',
      {
        rotationX: -30,
        rotationY: 0,
        rotationZ: -30,
        z: 100,
        opacity: 0,
      },
      {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        z: 0,
        opacity: 1,
        ease: 'power3.inOut',
        transformOrigin: '100% 50%',
        duration: 6,
        delay: 2,
      },
      '<',
    );
    const title3 = gsap.utils.toArray('.value-title3 path');
    const title4 = gsap.utils.toArray('.value-title4 path');
    const title5 = gsap.utils.toArray('.value-title5 path');
    title3.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        {
          stroke: '#BB1212',
          fill: 'none',
          drawSVG: 0,
        },
        {
          drawSVG: true,
          duration: 0.5,
          delay: 0.5,
          ease: 'power3.inOut',
        },
        '<',
      );
      tl.to(
        item,
        {
          fill: '#BB1212',
          duration: 0.3,
          delay: 0.3,
        },
        '<',
      );
    });
    title4.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        {
          stroke: '#BB1212',
          fill: 'none',
          drawSVG: 0,
        },
        {
          drawSVG: true,
          duration: 1,
          delay: 0.5,
          ease: 'power3.inOut',
        },
        '<',
      );
      tl.to(
        item,
        {
          fill: '#BB1212',
          duration: 0.3,
          delay: 1,
        },
        '<',
      );
    });
    title5.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        {
          stroke: '#BB1212',
          fill: 'none',
          drawSVG: 0,
        },
        {
          drawSVG: true,
          duration: 1,
          delay: 0.5,
          ease: 'power3.inOut',
        },
        '<',
      );
      tl.to(
        item,
        {
          fill: '#BB1212',
          duration: 0.3,
          delay: 1,
        },
        '<',
      );
    });
  };

  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    const title3 = gsap.utils.toArray('.value-title3 path');
    const title3cn = gsap.utils.toArray('.value-title3cn path');
    const title4 = gsap.utils.toArray('.value-title4 path');
    const title4cn = gsap.utils.toArray('.value-title4cn path');
    const title5 = gsap.utils.toArray('.value-title5 path');
    const title5cn = gsap.utils.toArray('.value-title5cn path');
    title3.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title4.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title5.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title3cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    title4cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    title5cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    tl.to('#fixed-value-page-2', {
      rotationX: -90,
      rotationY: 0,
      rotationZ: 0,
      z: 100,
      opacity: 0,
      ease: 'power3.inOut',
      transformOrigin: '50% 100%',
      duration: 6,
    });
    tl.to(
      camera.position,
      {
        ...page3Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      camera.rotation,
      {
        ...page3Config.to.camera.rotation,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(0);
        },
      },
      '<',
    );
    tl.fromTo(
      '#fixed-value-page-3',
      {
        rotationX: 120,
        rotationY: 0,
        rotationZ: 0,
        z: 100,
        opacity: 0,
      },
      {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        z: 0,
        opacity: 1,
        ease: 'power3.inOut',
        transformOrigin: 'top center',
        duration: 6,
        delay: 2,
      },
      '<',
    );
  };

  return {
    createPage1CrossAnim,
    createPage2CrossAnim,
  };
};
