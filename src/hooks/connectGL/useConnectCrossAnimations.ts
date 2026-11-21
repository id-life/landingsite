import { innerPageIndexAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Group } from 'three';
import gsap from 'gsap';
import { beats, STAGGER } from '@/motion/tokens';
import { COARSE_POINTER_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';
import { u } from '@/utils/layout-unit';
import { SECTIONS, TILT } from '@/motion/original';

/** The original's turn into Chinese: each glyph fades in 0.05 s (STAGGER.glyph apart, the original's 0.02 s). */
const GLYPH_TURN = 0.05;

/** The hold after Connect's rest label (see restAndHold). */
export const CONNECT_REST_HOLD = beats(0.25);

export const useConnectCrossAnimations = ({ modelRef }: { modelRef: React.RefObject<Group | null> }) => {
  const { camera } = useThree();
  const page1Config = useMemo(() => CONNECT_GL_CONFIG[0], []);

  const setValuePageIndex = useSetAtom(innerPageIndexAtom);
  const getTitle3CnElements = () => gsap.utils.toArray('.connect-title3cn path, .connect-title3cn-text');

  // The Connect section's scrubbed timeline (lengths in beats: shares of its scroll distance). It ends on the
  // 'rest' label, where the section controller lands every arrival (MOT-01). A short hold follows it, so the rest
  // sits inside the trigger rather than on its last pixel: there a read a fraction of a pixel short (the smoother's
  // own float, 21239.998 of 21240) re-entered the trigger, fired onEnterBack and brought the slogan back over the
  // contact footer. beats(0.25), as Portfolio's hold: 0.8 % of the trigger, 7 px at 900 px of height.
  const restAndHold = (tl: GSAPTimeline) => {
    tl.addLabel('rest');
    tl.to({}, { duration: CONNECT_REST_HOLD });
  };
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    tl.to(camera.position, { ...page1Config.from.camera.position, duration: beats(0.5) });
    tl.to(camera.rotation, { ...page1Config.from.camera.rotation, duration: beats(0.5) }, '<');
    tl.to('#fixed-connect', { opacity: 1, duration: beats(0.5) }, '<');
    tl.to('#vision-canvas', { zIndex: 1, opacity: 1, duration: beats(0.5) });
    if (!modelRef.current) {
      restAndHold(tl);
      return;
    }
    tl.to(camera.position, {
      motionPath: {
        path: [{ x: -2.38, y: -11.5, z: -4.4 }, { x: -4.8, y: -12.5, z: -4.1 }, { ...page1Config.to.camera.position }],
      },
      ease: SECTIONS.connectCameraEase,
      duration: beats(30),
    });
    tl.to(camera.rotation, { ...page1Config.to.camera.rotation, duration: beats(30) }, '<');
    tl.fromTo(
      '#fixed-connect-page-1',
      {
        rotationX: -TILT.connectPage,
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
    restAndHold(tl);
  };

  // Footer 动画 - 只显示底栏，不包含 EN→CN 动画
  const playFooterEnterAnim = () => {
    // Shows the contact footer only. It also used to flag the SUBSCRIBE popup as open, so on Connect the
    // header SUBSCRIBE button only shook an invisible popup; the popup now opens only on request.

    // 先停止footer相关的所有动画
    gsap.killTweensOf('.page-footer-contact');
    gsap.killTweensOf('.scroll-title');

    // The band floats 5 units above the bottom edge wherever the original's user-agent test called the device mobile:
    // the phone deck, and a touch screen on the laptop deck (a tablet on its side, where his band sits 5 units higher
    // than at the same window with a mouse). Read from the deck and the pointer (RWD-02), not the user agent.
    const raised = window.matchMedia(PHONE_TREE_QUERY).matches || window.matchMedia(COARSE_POINTER_QUERY).matches;
    gsap.to('.page-footer-contact', {
      bottom: raised ? u(5) : u(0),
      duration: SECTIONS.connectFooter.duration,
      ease: SECTIONS.connectFooter.ease,
    });
    gsap.to('.scroll-title', { opacity: 0, duration: SECTIONS.connectFooter.duration });
  };

  const playFooterLeaveAnim = () => {
    // 先停止footer相关的所有动画
    gsap.killTweensOf('.page-footer-contact');
    gsap.killTweensOf('.scroll-title');

    // Hidden by its own height (RWD-01: with the 12 px text floor the panel is taller than the old fixed offset, and
    // peeked over the hero on tablets).
    gsap.to('.page-footer-contact', {
      bottom: (_: number, el: HTMLElement) => -(el.offsetHeight + 16),
      duration: SECTIONS.connectFooter.duration,
      ease: SECTIONS.connectFooter.ease,
    });
    gsap.to('.scroll-title', { opacity: 1, duration: SECTIONS.connectFooter.duration });

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
      gsap.to(item, { opacity: 0, duration: SECTIONS.connectGlyph, delay: index * STAGGER.glyph, overwrite: 'auto' });
    });
    allEnTitles.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, {
        opacity: 1,
        duration: SECTIONS.connectGlyph,
        delay: cnDuration + index * STAGGER.glyph,
        overwrite: 'auto',
      });
    });
  };
  // The red English words turn into Chinese, letter by letter, as on the original (the owner's answer 1A, reversing
  // CON-12): the English glyphs go out one after another, then the Chinese paths come in, at the original's timings
  // (0.05 s each, 0.02 s apart). playFooterLeaveAnim brings the English back when the visitor leaves Connect.
  const playEnToCnAnim = () => {
    const title1 = gsap.utils.toArray('.connect-title1 *');
    const title1cn = gsap.utils.toArray('.connect-title1cn path');
    const title2 = gsap.utils.toArray('.connect-title2 *');
    const title2cn = gsap.utils.toArray('.connect-title2cn path');
    const title3 = gsap.utils.toArray('.connect-title3 *');
    const title3cn = getTitle3CnElements();
    const allEnTitles = [...title1, ...title2, ...title3];
    const allCnTitles = [...title1cn, ...title2cn, ...title3cn];
    gsap.killTweensOf(allEnTitles);
    gsap.killTweensOf(allCnTitles);
    const enDuration = allEnTitles.length * STAGGER.glyph;
    allEnTitles.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, { opacity: 0, duration: GLYPH_TURN, delay: index * STAGGER.glyph, overwrite: 'auto' });
    });
    allCnTitles.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, { opacity: 1, duration: GLYPH_TURN, delay: enDuration + index * STAGGER.glyph, overwrite: 'auto' });
    });
  };
  return {
    createPage1CrossAnim,
    playFooterEnterAnim,
    playFooterLeaveAnim,
    playEnToCnAnim,
  };
};
