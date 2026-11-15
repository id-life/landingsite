import { currentPageAtom } from '@/atoms';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { useConnectCrossAnimations } from '@/hooks/connectGL/useConnectCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { memo, RefObject, useRef } from 'react';
import * as THREE from 'three';

type TitleProps = {
  titleRef: RefObject<THREE.Group | null>;
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

  // The headlines stay in English: they used to turn into Chinese word by word 1 s after Connect
  // appeared (playEnToCnAnim), so a reader lost the sentence being read (CON-12).
  const { createPage1CrossAnim, playFooterEnterAnim, playFooterLeaveAnim } = useConnectCrossAnimations({
    modelRef,
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
            if (isLayoutRefreshing()) return;
            setCurrentPage(NAV_LIST[6]);
            // 立即显示底栏. (It also used to pause the smoother and auto-scroll for 3 s to the end of this
            // trigger; the section controller now lands on the timeline's 'rest' label, MOT-01.)
            playFooterEnterAnim();
          },
          onEnterBack: () => {
            if (isLayoutRefreshing()) return;
            playFooterLeaveAnim();
          },
          onLeave: () => {
            if (isLayoutRefreshing()) return;
            // 立即显示底栏
            playFooterEnterAnim();
          },
          onLeaveBack: () => {
            if (isLayoutRefreshing()) return;
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
