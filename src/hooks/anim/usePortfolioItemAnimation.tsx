import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { RefObject } from 'react';
import { useThrottle } from '../useThrottle';

export interface PortfolioItemAnimationConfig {
  /** 组件是否启用 */
  enabled?: boolean;
  /** 图像索引更新的节流延迟 */
  throttleDelay?: number;
}

/**
 * Portfolio 项目悬停动画 Hook
 * 专门处理 Portfolio 组件中的复杂悬停动画逻辑
 */
export function usePortfolioItemAnimation(
  wrapperRef: RefObject<HTMLDivElement>,
  portfolioRefs: RefObject<HTMLDivElement[]>,
  onImageIndexChange: (index: number) => void,
  config: PortfolioItemAnimationConfig = {},
) {
  const { enabled = true, throttleDelay = 200 } = config;
  const { contextSafe } = useGSAP();

  // 创建节流的图像索引更新函数
  const throttledSetImageIdx = useThrottle((index: number) => {
    onImageIndexChange(index);
  }, throttleDelay);

  // 创建单个项目的悬停动画
  const createItemHoverAnimation = contextSafe((div: HTMLDivElement) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out', duration: 0.3 },
    });

    // 主要缩放动画
    tl.to(div, { scale: 1.1 });

    // 子元素动画
    const title = div.querySelector('.fund-title');
    const selected = title?.querySelectorAll('img');
    const desc = div.querySelector('.fund-desc');
    const subtitle = div.querySelector('.fund-subtitle');

    if (title) {
      tl.to(title, { fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.75rem' });
    }

    if (selected) {
      tl.to(selected, { opacity: 1 });
    }

    if (desc) {
      tl.from(
        desc,
        {
          opacity: 0,
          translateY: '50%',
        },
        '<50%',
      );
    }

    if (subtitle) {
      tl.from(
        subtitle,
        {
          opacity: 0,
          translateY: '50%',
        },
        '<50%',
      );
    }

    return tl;
  });

  useGSAP(
    () => {
      if (!enabled || !portfolioRefs.current?.length || !wrapperRef.current) return;

      let isMouseInFundArea = false;
      const wrapper = wrapperRef.current.querySelector('.page2-fund');

      if (!wrapper) return;

      // 整个资金区域的事件监听
      const handleWrapperMouseEnter = () => {
        isMouseInFundArea = true;
      };

      const handleWrapperMouseLeave = () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      };

      wrapper.addEventListener('mouseenter', handleWrapperMouseEnter);
      wrapper.addEventListener('mouseleave', handleWrapperMouseLeave);

      // 为每个项目创建动画和事件监听
      const itemAnimations: gsap.core.Timeline[] = [];

      portfolioRefs.current.forEach((div, idx) => {
        if (!div) return;

        const animation = createItemHoverAnimation(div);
        itemAnimations.push(animation);

        const handleMouseEnter = () => {
          throttledSetImageIdx(idx + 1);
          animation.play();
        };

        const handleMouseLeave = () => {
          animation.reverse();
          // 只有当鼠标确实离开整个资金区域时才重置图像索引
          if (!isMouseInFundArea) {
            throttledSetImageIdx(0);
          }
        };

        div.addEventListener('mouseenter', handleMouseEnter);
        div.addEventListener('mouseleave', handleMouseLeave);
      });
    },
    {
      scope: wrapperRef,
      dependencies: [enabled, portfolioRefs.current?.length],
      revertOnUpdate: true, // 自动清理事件监听器和动画
    },
  );

  return {
    throttledSetImageIdx,
  };
}
