import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { RefObject } from 'react';
import { useThrottle } from '../useThrottle';
import { DURATION } from '@/motion/tokens';
import { SECTIONS } from '@/motion/original';

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
  wrapperRef: RefObject<HTMLDivElement | null>,
  portfolioRefs: RefObject<HTMLDivElement[] | null>,
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
      defaults: { ease: SECTIONS.portfolioHover.ease, duration: SECTIONS.portfolioHover.duration },
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

    // The one-liner appears on hover, as the original animates it; a tap or keyboard focus plays the same state
    // (one tile at a time, below), so touch and keyboard visitors read it too, and the rest state is the original's.
    // Hidden by a set, then shown by a tween: a from() tween hid them only while its duration was above zero, and
    // with the reduced-motion preference (every DURATION 0) the one-liners stood shown at rest on the laptop deck,
    // where the original shows none until a hover or a tap.
    if (desc) {
      gsap.set(desc, { opacity: 0, translateY: '50%' });
      tl.to(desc, { opacity: 1, translateY: 0 }, '<50%');
    }

    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, translateY: '50%' });
      tl.to(subtitle, { opacity: 1, translateY: 0 }, '<50%');
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
      // revertOnUpdate reverts the tweens, not DOM listeners: each one is removed here (MOT-14).
      const removers: (() => void)[] = [
        () => wrapper.removeEventListener('mouseenter', handleWrapperMouseEnter),
        () => wrapper.removeEventListener('mouseleave', handleWrapperMouseLeave),
      ];

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

        // Touch and keyboard: the tapped or focused tile shows its one-liner, and the previous one closes.
        const show = () => {
          itemAnimations.forEach((other) => other !== animation && other.reverse());
          animation.play();
        };
        const handlePointerDown = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') show();
        };
        const handleFocusIn = () => show();
        const handleFocusOut = (event: FocusEvent) => {
          if (!div.contains(event.relatedTarget as Node | null)) animation.reverse();
        };

        div.addEventListener('mouseenter', handleMouseEnter);
        div.addEventListener('mouseleave', handleMouseLeave);
        div.addEventListener('pointerdown', handlePointerDown);
        div.addEventListener('focusin', handleFocusIn);
        div.addEventListener('focusout', handleFocusOut);
        removers.push(() => {
          div.removeEventListener('mouseenter', handleMouseEnter);
          div.removeEventListener('mouseleave', handleMouseLeave);
          div.removeEventListener('pointerdown', handlePointerDown);
          div.removeEventListener('focusin', handleFocusIn);
          div.removeEventListener('focusout', handleFocusOut);
        });
      });
      return () => removers.forEach((remove) => remove());
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
