import { innerPageIndexAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group, Vector3 } from 'three';

export const centerPoint = new Vector3(0, -10, 0);

export const useMobileConnectCrossAnimations = ({
  modelRef,
  isScrollingRef,
}: {
  modelRef: React.RefObject<Group>;
  isScrollingRef: React.RefObject<boolean>;
}) => {
  const { camera } = useThree();
  const setValuePageIndex = useSetAtom(innerPageIndexAtom);
  const page2Config = useMemo(() => CONNECT_GL_CONFIG[1], []);
  const page3Config = useMemo(() => CONNECT_GL_CONFIG[2], []);

  // page cross anim
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    tl.to(
      camera.position,
      {
        ...page2Config.to.camera.position,
        duration: 10,
        ease: 'power2.inOut',
      },
      // '<',
    );
    tl.to(
      camera.rotation,
      {
        ...page2Config.to.camera.rotation,
        duration: 10,
        ease: 'power2.inOut',
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

    tl.to('#connect-1-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#connect-2-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!modelRef.current) return;
    tl.to(
      camera.position,
      {
        ...page3Config.to.camera.position,
        duration: 10,
        ease: 'power2.inOut',
      },
      // '<',
    );
    tl.to(
      camera.rotation,
      {
        ...page3Config.to.camera.rotation,
        duration: 10,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
      },
      '<',
    );

    tl.to('#connect-2-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#connect-3-svg-mobile', { opacity: 1, duration: 0, ease: 'power3.out' });
  };

  return {
    createPage1CrossAnim,
    createPage2CrossAnim,
  };
};
