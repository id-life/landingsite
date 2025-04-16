import { innerPageIndexAtom } from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group, Vector3 } from 'three';
import gsap from 'gsap';

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
    title1cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    title2.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title2cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    tl.to(
      camera.position,
      {
        ...page2Config.to.camera.position,
        duration: 30,
        ease: 'power3.in',
      },
      '-=5',
    );
    tl.to(
      camera.rotation,
      {
        ...page2Config.to.camera.rotation,
        duration: 30,
        ease: 'power3.in',
        onComplete: () => {
          camera.lookAt(new Vector3(-0.3647, -9.6052, 0.7945));
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(0);
        },
      },
      '<',
    );
    tl.to(
      '#fixed-value-page-1',
      {
        rotationX: 30,
        rotationZ: 30,
        z: 100,
        opacity: 0,
        transformOrigin: '100% 0%',
        duration: 6,
      },
      '-=12',
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
        transformOrigin: '100% 50%',
        duration: 6,
      },
      '-=10',
    );
    const title8 = gsap.utils.toArray('.value-title8 path');
    const title9 = gsap.utils.toArray('.value-title9 path');
    const title3 = gsap.utils.toArray('.value-title3 path');
    const title3cn = gsap.utils.toArray('.value-title3cn path');
    title8.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        {
          stroke: 'black',
          fill: 'none',
          drawSVG: 0,
        },
        {
          drawSVG: true,
          duration: 0.1,
          delay: 0.3,
        },
        '<',
      );
      tl.to(
        item,
        {
          fill: 'black',
          duration: 0.1,
          delay: 0.3,
        },
        '<',
      );
    });
    title9.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        {
          stroke: 'black',
          fill: 'none',
          drawSVG: 0,
        },
        {
          drawSVG: true,
          duration: 1,
          delay: 0.3,
        },
        '<',
      );
      tl.to(
        item,
        {
          fill: 'black',
          duration: 0.1,
          delay: 0.3,
        },
        '<',
      );
    });
    title3.forEach((item, index) => {
      if (!item) return;
      if (index === 0) {
        tl.to(item, { opacity: 0, duration: 0.2, delay: 0.2 }, '-=3');
      }
      tl.to(item, { opacity: 0, duration: 0.2, delay: 0.2 }, '<');
    });
    title3cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 }, '<');
    });
  };

  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    const title4 = gsap.utils.toArray('.value-title4 path');
    const title4cn = gsap.utils.toArray('.value-title4cn path');
    const title5 = gsap.utils.toArray('.value-title5 path');
    const title5cn = gsap.utils.toArray('.value-title5cn path');
    title4.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title5.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.1, delay: 0.1 });
    });
    title4cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });
    title5cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0, delay: 0.1 }, { opacity: 1, duration: 0.1, delay: 0.1 });
    });

    tl.to(
      camera.position,
      {
        ...page3Config.to.camera.position,
        duration: 30,
        onUpdate: () => {
          camera.lookAt(new Vector3(-0.3647, -9.6052, 0.7945));
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
      },
      '-=4',
    );
    tl.to(
      '#fixed-value-page-2',
      {
        rotationX: -90,
        rotationY: 0,
        rotationZ: 0,
        z: 10,
        opacity: 0,
        transformOrigin: '50% 100%',
        duration: 8,
      },
      '-=18',
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
        transformOrigin: 'top center',
        duration: 8,
      },
      '-=16',
    );
  };

  return {
    createPage1CrossAnim,
    createPage2CrossAnim,
  };
};
