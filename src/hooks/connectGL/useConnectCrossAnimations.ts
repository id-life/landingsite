import { innerPageIndexAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group, Vector3 } from 'three';
import gsap from 'gsap';

export const useConnectCrossAnimations = ({ modelRef }: { modelRef: React.RefObject<Group> }) => {
  const { camera } = useThree();
  const page1Config = useMemo(() => CONNECT_GL_CONFIG[0], []);
  const page2Config = useMemo(() => CONNECT_GL_CONFIG[1], []);
  const page3Config = useMemo(() => CONNECT_GL_CONFIG[2], []);

  const setValuePageIndex = useSetAtom(innerPageIndexAtom);

  // page cross anim
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    tl.to(camera.position, { ...page1Config.from.camera.position, duration: 0.5 });
    tl.to(camera.rotation, { ...page1Config.from.camera.rotation, duration: 0.5 }, '<');
    tl.to('#fixed-connect', { opacity: 1, duration: 0.5 }, '<');
    tl.to('#vision-canvas', { zIndex: 1, opacity: 1, duration: 0.5 });
    if (!modelRef.current) return;
    tl.to(camera.position, {
      motionPath: {
        path: [{ x: -2.38, y: -11.5, z: -4.4 }, { x: -4.8, y: -12.5, z: -4.1 }, { ...page1Config.to.camera.position }],
      },
      ease: 'power1.out',
      duration: 30,
    });
    tl.to(camera.rotation, { ...page1Config.to.camera.rotation, duration: 30 }, '<');
    tl.fromTo(
      '#fixed-connect-page-1',
      {
        rotationX: -30,
        rotationY: 0,
        rotationZ: -30,
        z: 100,
        y: 300,
        x: 300,
        opacity: 0,
      },
      {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        y: 0,
        x: 0,
        z: 0,
        opacity: 1,
        transformOrigin: '100% 50%',
        duration: 15,
      },
      '<',
    );
    const title6 = gsap.utils.toArray('.connect-title6 *');
    const title7 = gsap.utils.toArray('.connect-title7 *');
    [...title6, ...title7].forEach((item, index) => {
      if (!item) return;
      tl.fromTo(
        item,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: index * 0.5,
        },
        '0',
      );
    });
  };
  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    const title1 = gsap.utils.toArray('.connect-title1 *');
    const title1cn = gsap.utils.toArray('.connect-title1cn path');
    const title2 = gsap.utils.toArray('.connect-title2 *');
    const title2cn = gsap.utils.toArray('.connect-title2cn path');
    title1.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.5, delay: 1 });
    });
    title1cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1 });
    });
    title2.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.5, delay: 1 });
    });
    title2cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1 });
    });

    // Page3
    tl.to(camera.position, {
      ...page2Config.to.camera.position,
      delay: 5,
      duration: 20,
      ease: 'none',
    });
    tl.to(
      camera.rotation,
      {
        ...page2Config.to.camera.rotation,
        duration: 20,
        ease: 'none',
      },
      '<',
    );
    tl.to(
      '#fixed-connect-page-1',
      {
        rotationX: 30,
        rotationZ: 30,
        z: 100,
        opacity: 0,
        transformOrigin: '100% 0%',
        duration: 10,
      },
      '<',
    );
    tl.fromTo(
      '#fixed-connect-page-2',
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
        duration: 10,
      },
      '<',
    );
    const title8 = gsap.utils.toArray('.connect-title8 *');
    title8.forEach((item, index) => {
      if (!item) return;
      tl.fromTo(
        item,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          delay: index * 0.9,
        },
        0,
      );
    });
  };
  const createPage3CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    // page 4
    const title3 = gsap.utils.toArray('.connect-title3 *');
    const title3cn = gsap.utils.toArray('.connect-title3cn path');
    const title4 = gsap.utils.toArray('.connect-title4 *');
    const title4cn = gsap.utils.toArray('.connect-title4cn path');
    const title5 = gsap.utils.toArray('.connect-title5 *');
    const title5cn = gsap.utils.toArray('.connect-title5cn path');
    title3.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.5, delay: 0.5 });
    });
    title3cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    });
    title4.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.5, delay: 0.5 });
    });
    title5.forEach((item) => {
      if (!item) return;
      tl.to(item, { opacity: 0, duration: 0.5, delay: 0.5 });
    });
    title4cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    });
    title5cn.forEach((item) => {
      if (!item) return;
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 });
    });

    // page 5
    tl.to(camera.position, {
      ...page3Config.to.camera.position,
      delay: 5,
      duration: 20,
      onUpdate: () => {
        camera.lookAt(new Vector3(-0.3647, -9.6052, 0.7945));
      },
    });
    tl.to(
      '#fixed-connect-page-2',
      {
        rotationX: -90,
        rotationY: 0,
        rotationZ: 0,
        z: 10,
        opacity: 0,
        transformOrigin: '50% 100%',
        duration: 10,
      },
      '<30%',
    );
    tl.fromTo(
      '#fixed-connect-page-3',
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
        duration: 10,
      },
      '<30%',
    );
  };

  return {
    createPage1CrossAnim,
    createPage2CrossAnim,
    createPage3CrossAnim,
  };
};
