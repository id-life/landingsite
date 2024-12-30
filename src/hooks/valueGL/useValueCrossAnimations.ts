import { valuePageIndexAtom } from '@/atoms';
import { model2VisibleAtom, model3VisibleAtom, model4VisibleAtom } from '@/atoms/geo';
import { MODEL_CONFIG } from '@/components/gl/config/animalConfig';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import { useThree } from '@react-three/fiber';
import { useAtom, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { useMemo } from 'react';
import { Group, Vector3 } from 'three';
import { useIsMobile } from '../useIsMobile';
import { useValueCalcPosition } from './useValueCalcPosition';

export const centerPoint = new Vector3(0, -10, 0);
const modelConfig = MODEL_CONFIG[2];

export const useValueCrossAnimations = ({
  title1Ref,
  title2Ref,
  title3Ref,
  title4Ref,
  modelRef,
  isScrollingRef,
}: {
  title1Ref: React.RefObject<Group>;
  title2Ref: React.RefObject<Group>;
  title3Ref: React.RefObject<Group>;
  title4Ref: React.RefObject<Group>;
  modelRef: React.RefObject<Group>;
  isScrollingRef: React.RefObject<boolean>;
}) => {
  const isMobile = useIsMobile();
  const { camera } = useThree();
  const page2Config = useMemo(() => VALUE_GL_CONFIG[1], []);
  const page3Config = useMemo(() => VALUE_GL_CONFIG[2], []);
  const page4Config = useMemo(() => VALUE_GL_CONFIG[3], []);
  const page5Config = useMemo(() => VALUE_GL_CONFIG[4], []);

  const { getScalePosition } = useValueCalcPosition();

  const [model2Visible, setModel2Visible] = useAtom(model2VisibleAtom);
  const [model3Visible, setModel3Visible] = useAtom(model3VisibleAtom);
  const setModel4Visible = useSetAtom(model4VisibleAtom);
  const setValuePageIndex = useSetAtom(valuePageIndexAtom);

  // page cross anim
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    if (!title1Ref.current || !modelRef.current) return;
    tl.to(title1Ref.current.position, {
      ...getScalePosition(page2Config.to.prevTitle.position),
      ease: 'power3.inOut',
      duration: 8,
    });
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page2Config.to.model.mobilePos : page2Config.to.model.position),
        ease: 'power3.inOut',
        duration: 8,
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(0);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...page2Config.to.model.rotation,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page2Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );

    tl.to('#page-value-1', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-1-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-2', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-2-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!title2Ref.current || !title3Ref.current || !modelRef.current) return;

    const throttleSetModel3Visible = throttle(() => {
      // console.log('model 小精灵出现');
      if (title2Ref.current) title2Ref.current.visible = false;
      if (model3Visible) return;
      setModel2Visible(false);
      setModel3Visible(true);
      setModel4Visible(false);
    }, 500);
    const throttleSetModel2Visible = throttle(() => {
      // console.log('model 水母出现');
      if (title2Ref.current) title2Ref.current.visible = true;
      if (model2Visible) return;
      setModel2Visible(true);
      setModel3Visible(false);
      setModel4Visible(false);
    }, 500);

    tl.to(title2Ref.current.position, {
      ...getScalePosition(page3Config.to.prevTitle.position),
      ease: 'power3.inOut',
      duration: 8,
      onUpdate() {
        // console.log('progress:', this.progress());
        const progress = this.progress();
        if (progress > 0.5) {
          throttleSetModel3Visible();
        }
        if (progress < 0.5) {
          throttleSetModel2Visible();
        }
      },
    });
    tl.to(
      title3Ref.current.position,
      {
        ...getScalePosition(page3Config.to.title.position),
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page3Config.to.model.mobilePos : page3Config.to.model.position),
        ease: 'power3.inOut',
        duration: 8,

        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.children[0].position,
      {
        x: modelConfig.pos1[0].x,
        y: modelConfig.pos1[0].y,
        z: modelConfig.pos1[0].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.children[1].position,
      {
        x: modelConfig.pos1[1].x,
        y: modelConfig.pos1[1].y,
        z: modelConfig.pos1[1].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.children[2].position,
      {
        x: modelConfig.pos1[2].x,
        y: modelConfig.pos1[2].y,
        z: modelConfig.pos1[2].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...(isMobile ? page3Config.to.model.mobileRot : page3Config.to.model.rotation),
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page3Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-2', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-2-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-3', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-3-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage3CrossAnim = (tl: GSAPTimeline) => {
    if (!title3Ref.current || !title4Ref.current || !modelRef.current) return;

    tl.to(title3Ref.current.position, {
      ...getScalePosition(page4Config.to.prevTitle.position),
      duration: 8,
      ease: 'power3.inOut',
    });
    tl.to(
      title4Ref.current.position,
      {
        ...getScalePosition(page4Config.to.title.position),
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page4Config.to.model.mobilePos : page4Config.to.model.position),
        duration: 8,
        ease: 'power3.inOut',
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(3);
        },
        onReverseComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...(isMobile ? page4Config.to.model.mobileRot : page4Config.to.model.rotation),
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page4Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-3', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-3-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-4', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-4-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage4CrossAnim = (tl: GSAPTimeline) => {
    if (!title4Ref.current || !modelRef.current) return;
    // 第四页到第五页的过渡动画
    tl.to(title4Ref.current.position, {
      ...getScalePosition(page5Config.to.prevTitle.position),
      duration: 3,
      ease: 'power3.inOut',
    });

    // 移动模型的三个部分到新位置
    // 第一个部分 水母
    tl.to(
      modelRef.current.children[0].position,
      {
        x: modelConfig.pos2[0].x,
        y: modelConfig.pos2[0].y,
        z: modelConfig.pos2[0].z,
        ease: 'power3.inOut',
        duration: 3,
      },
      '<',
    );
    // 第二个部分 小精灵 由于不再随机了所以 这块注释掉了，若后续又需要随机了再加回来。
    // tl.to(
    //   modelRef.current.children[1].position,
    //   {
    //     x: modelConfig.pos2[1].x,
    //     y: modelConfig.pos2[1].y,
    //     z: modelConfig.pos2[1].z,
    //     ease: 'power3.inOut',
    //     duration: 3,
    //   },
    //   '<',
    // );
    // 第三个模型 海马（移动端x坐标特殊处理）
    tl.to(
      modelRef.current.children[2].position,
      {
        x: isMobile ? 0 : modelConfig.pos2[2].x,
        y: modelConfig.pos2[2].y,
        z: modelConfig.pos2[2].z,
        ease: 'power3.inOut',
        duration: 3,
      },
      '<',
    );
    // 移动相机并保持注视中心点
    tl.to(
      camera.position,
      {
        ...page5Config.to.camera.position,
        duration: 3,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );

    // 淡出第4页右下角内容
    tl.to('#page-value-4', { opacity: 0, duration: 3, ease: 'power3.in' }, '<');
    // 移动端特殊处理：淡出SVG
    if (isMobile) tl.to('#value-4-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
  };
  return {
    createPage1CrossAnim,
    createPage2CrossAnim,
    createPage3CrossAnim,
    createPage4CrossAnim,
  };
};
