import { innerPageIndexAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group } from 'three';
import gsap from 'gsap';
import { beats, DURATION, EASE, MAX_TILT, STAGGER } from '@/motion/tokens';
import { isMobile } from 'react-device-detect';

export const useConnectCrossAnimations = ({ modelRef }: { modelRef: React.RefObject<Group | null> }) => {
  const { camera } = useThree();
  const page1Config = useMemo(() => CONNECT_GL_CONFIG[0], []);

  const setValuePageIndex = useSetAtom(innerPageIndexAtom);
  const getTitle3CnElements = () => gsap.utils.toArray('.connect-title3cn path, .connect-title3cn-text');

  // The Connect section's scrubbed timeline (lengths in beats: shares of its scroll distance). It ends on the
  // 'rest' label, where the section controller lands every arrival (MOT-01).
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    tl.to(camera.position, { ...page1Config.from.camera.position, duration: beats(0.5) });
    tl.to(camera.rotation, { ...page1Config.from.camera.rotation, duration: beats(0.5) }, '<');
    tl.to('#fixed-connect', { opacity: 1, duration: beats(0.5) }, '<');
    tl.to('#vision-canvas', { zIndex: 1, opacity: 1, duration: beats(0.5) });
    if (!modelRef.current) {
      tl.addLabel('rest');
      return;
    }
    tl.to(camera.position, {
      motionPath: {
        path: [{ x: -2.38, y: -11.5, z: -4.4 }, { x: -4.8, y: -12.5, z: -4.1 }, { ...page1Config.to.camera.position }],
      },
      ease: EASE.out,
      duration: beats(30),
    });
    tl.to(camera.rotation, { ...page1Config.to.camera.rotation, duration: beats(30) }, '<');
    tl.fromTo(
      '#fixed-connect-page-1',
      {
        rotationX: -MAX_TILT,
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
        duration: beats(15),
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
          duration: beats(1),
          delay: index * beats(0.5),
        },
        '0',
      );
    });
    tl.addLabel('rest');
  };

  // Footer 动画 - 只显示底栏，不包含 EN→CN 动画
  const playFooterEnterAnim = () => {
    // Shows the contact footer only. It also used to flag the SUBSCRIBE popup as open, so on Connect the
    // header SUBSCRIBE button only shook an invisible popup; the popup now opens only on request.

    // 先停止footer相关的所有动画
    gsap.killTweensOf('.page-footer-contact');
    gsap.killTweensOf('.sound-button');
    gsap.killTweensOf('.scroll-title');

    gsap.to('.page-footer-contact', { bottom: isMobile ? '5rem' : '0rem', duration: DURATION.moderate, ease: EASE.out });
    gsap.to('.sound-button', { bottom: isMobile ? '25.5rem' : '22.5rem', duration: DURATION.moderate, ease: EASE.out });
    gsap.to('.scroll-title', { opacity: 0, duration: DURATION.moderate });
  };

  const playFooterLeaveAnim = () => {
    // 先停止footer相关的所有动画
    gsap.killTweensOf('.page-footer-contact');
    gsap.killTweensOf('.sound-button');
    gsap.killTweensOf('.scroll-title');

    gsap.to('.page-footer-contact', { bottom: '-20rem', duration: DURATION.moderate, ease: EASE.out });
    gsap.to('.sound-button', { bottom: '2.5rem', duration: DURATION.moderate, ease: EASE.out });
    gsap.to('.scroll-title', { opacity: 1, duration: DURATION.moderate });

    // 中文标题一个一个消失，然后英文标题一个一个出现
    const title1 = gsap.utils.toArray('.connect-title1 *');
    const title1cn = gsap.utils.toArray('.connect-title1cn path');
    const title2 = gsap.utils.toArray('.connect-title2 *');
    const title2cn = gsap.utils.toArray('.connect-title2cn path');
    const title3 = gsap.utils.toArray('.connect-title3 *');
    const title3cn = getTitle3CnElements();
    const allEnTitles = [...title1, ...title2, ...title3];
    const allCnTitles = [...title1cn, ...title2cn, ...title3cn];

    // Stop any in-flight title tweens to avoid overlap
    gsap.killTweensOf(allEnTitles);
    gsap.killTweensOf(allCnTitles);

    const cnDuration = allCnTitles.length * STAGGER.glyph;
    allCnTitles.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, { opacity: 0, duration: DURATION.micro, delay: index * STAGGER.glyph, overwrite: 'auto' });
    });
    allEnTitles.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, { opacity: 1, duration: DURATION.micro, delay: cnDuration + index * STAGGER.glyph, overwrite: 'auto' });
    });
  };
  return {
    createPage1CrossAnim,
    playFooterEnterAnim,
    playFooterLeaveAnim,
  };
};
