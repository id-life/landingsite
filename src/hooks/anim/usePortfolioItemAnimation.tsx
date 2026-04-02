import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { RefObject } from 'react';
import { useThrottle } from '../useThrottle';

export interface PortfolioItemAnimationConfig {
  /** 缁勪欢鏄惁鍚敤 */
  enabled?: boolean;
  /** 鍥惧儚绱㈠紩鏇存柊鐨勮妭娴佸欢杩?*/
  throttleDelay?: number;
}

/**
 * Portfolio 椤圭洰鎮仠鍔ㄧ敾 Hook
 * 涓撻棬澶勭悊 Portfolio 缁勪欢涓殑澶嶆潅鎮仠鍔ㄧ敾閫昏緫
 */
export function usePortfolioItemAnimation(
  wrapperRef: RefObject<HTMLDivElement>,
  portfolioRefs: RefObject<HTMLDivElement[]>,
  onImageIndexChange: (index: number) => void,
  config: PortfolioItemAnimationConfig = {},
) {
  const { enabled = true, throttleDelay = 200 } = config;
  const { contextSafe } = useGSAP();

  // 鍒涘缓鑺傛祦鐨勫浘鍍忕储寮曟洿鏂板嚱鏁?
  const throttledSetImageIdx = useThrottle((index: number) => {
    onImageIndexChange(index);
  }, throttleDelay);

  // 鍒涘缓鍗曚釜椤圭洰鐨勬偓鍋滃姩鐢?
  const createItemHoverAnimation = contextSafe((div: HTMLDivElement) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out', duration: 0.3 },
    });

    // 涓昏缂╂斁鍔ㄧ敾

    // 瀛愬厓绱犲姩鐢?
    const title = div.querySelector('.fund-title');
    const selected = title?.querySelectorAll('img');
    const desc = div.querySelector('.fund-desc');
    const subtitle = div.querySelector('.fund-subtitle');

    if (title) {
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

      // 鏁翠釜璧勯噾鍖哄煙鐨勪簨浠剁洃鍚?
      const handleWrapperMouseEnter = () => {
        isMouseInFundArea = true;
      };

      const handleWrapperMouseLeave = () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      };

      wrapper.addEventListener('mouseenter', handleWrapperMouseEnter);
      wrapper.addEventListener('mouseleave', handleWrapperMouseLeave);

      // 涓烘瘡涓」鐩垱寤哄姩鐢诲拰浜嬩欢鐩戝惉
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
          // 鍙湁褰撻紶鏍囩‘瀹炵寮€鏁翠釜璧勯噾鍖哄煙鏃舵墠閲嶇疆鍥惧儚绱㈠紩
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
      revertOnUpdate: true, // 鑷姩娓呯悊浜嬩欢鐩戝惉鍣ㄥ拰鍔ㄧ敾
    },
  );

  return {
    throttledSetImageIdx,
  };
}
