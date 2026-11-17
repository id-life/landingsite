import { mobileCurrentPageAtom } from '@/atoms';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { layoutUnitPx } from '@/utils/layout-unit';
import { NAV_LIST } from '../nav/nav';
import { EASE } from '@/motion/tokens';
import { useReducedMotionPref } from '@/motion/preference';

interface VerticalCarouselProps {
  children: ReactNode[];
  className?: string;
  itemHeight?: number; // 每个项目的高度(px)
  duration?: number; // 停留时间(秒)
  transition?: number; // 过渡时间(秒)
  slideDown?: boolean; // 控制最后一个的时候是否向下滑动
  itemClassName?: string;
  /**
   * itemHeight is in px at a 16 px layout unit and follows the deck's unit (the phone deck grows above phone width,
   * where a fixed box would cut its larger text). Off: plain px.
   */
  scaleWithUnit?: boolean;
}

export default function VerticalCarousel({
  children,
  className,
  itemHeight: itemHeightAtUnit = 45,
  duration = 3,
  transition = 0.6,
  slideDown = false, // 添加新参数
  itemClassName,
  scaleWithUnit = false,
}: VerticalCarouselProps) {
  const [unitScale, setUnitScale] = useState(1);
  useEffect(() => {
    if (!scaleWithUnit) return;
    const read = () => setUnitScale(layoutUnitPx() / 16);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [scaleWithUnit]);
  const itemHeight = itemHeightAtUnit * unitScale;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemClass = useMemo(() => {
    return cn('mobile:flex mobile:flex-col mobile:items-center mobile:justify-center', itemClassName);
  }, [itemClassName]);
  const isMobile = useIsMobile();
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);

  // Fixed order (it used to shuffle on every mount, so each visit read the slogans in a new order).
  const items = children;

  const reduced = useReducedMotionPref();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef = useRef<boolean>(true); // 跟踪当前页面是否激活

  // 创建动画的函数
  const createAnimation = () => {
    if (!containerRef.current) return;

    // 清理之前的动画
    if (tlRef.current) {
      tlRef.current.kill();
    }

    // 重置容器位置和子元素样式
    gsap.set(containerRef.current, { y: 0 });
    const elements = containerRef.current.children;
    Array.from(elements).forEach((el) => {
      gsap.set(el, { opacity: 1 });
    });

    // Reduced motion (MOT-02): the first slogan stays; nothing cycles by itself.
    if (reduced) return;

    tlRef.current = gsap.timeline({
      repeat: -1,
      smoothChildTiming: true, // 确保子动画平滑过渡
    });
    const tl = tlRef.current;
    const totalItems = items.length;

    if (slideDown) {
      // 向下滑动的动画逻辑
      for (let index = 0; index < totalItems; index++) {
        if (index > 0) {
          // 前一个元素淡出
          tl.to(
            elements[index - 1],
            {
              opacity: 0,
              duration: transition / 2,
              ease: EASE.inOut,
            },
            `item${index}-start`,
          );
        }

        // 当前元素移入视图
        tl.to(
          containerRef.current,
          {
            y: `-${index * itemHeight}px`,
            duration: transition,
            ease: EASE.inOut,
          },
          index > 0 ? `item${index}-start` : undefined,
        )
          .addLabel(`item${index}-start`)
          .to(containerRef.current, {
            duration: duration,
          });
      }

      // 平滑过渡回到第一个元素
      // 最后一个元素淡出
      tl.to(
        elements[totalItems - 1],
        {
          opacity: 0,
          duration: transition / 2,
          ease: EASE.inOut,
        },
        'loop-start',
      );

      // 容器平滑移动到克隆的第一个元素位置
      tl.to(
        containerRef.current,
        {
          y: `-${totalItems * itemHeight}px`,
          duration: transition,
          ease: EASE.inOut,
          onComplete: () => {
            // 动画完成后立即重置位置到顶部，但不显示这个过程
            if (containerRef.current) {
              gsap.set(containerRef.current, { y: 0 });
              // 重置所有子元素的不透明度
              Array.from(elements).forEach((el) => {
                gsap.set(el, { opacity: 1 });
              });
            }
          },
        },
        'loop-start',
      ).addLabel('loop-start');
    } else {
      // 原来的向上滑动逻辑，但增加了平滑效果
      items.forEach((_, index) => {
        tl.to(containerRef.current, {
          y: `-${index * itemHeight}px`,
          duration: transition,
          ease: EASE.inOut,
        }).to(containerRef.current, {
          duration: duration,
        });
      });

      // 回到第一个，带有平滑过渡
      tl.to(containerRef.current, {
        y: `-${totalItems * itemHeight}px`,
        duration: transition,
        ease: EASE.inOut,
        onComplete: () => {
          // 动画完成后立即重置位置到顶部，但不显示这个过程
          if (containerRef.current) {
            gsap.set(containerRef.current, { y: 0 });
          }
        },
      });
    }

    // 如果当前页面不是首页，立即暂停动画
    if (isMobile && mobileCurrentPage.id !== NAV_LIST[0]?.id) {
      tl.pause();
    }
  };

  useEffect(() => {
    createAnimation();
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, itemHeight, duration, transition, slideDown, reduced]);

  // 监听页面变化，控制动画
  useEffect(() => {
    if (!isMobile || !tlRef.current || !mobileCurrentPage) return;

    const isCurrentlyActive = mobileCurrentPage.id === NAV_LIST[0].id;

    if (isCurrentlyActive && !isActiveRef.current) {
      // 从非首页切换回首页时，重新创建动画以确保从头开始
      createAnimation();
      isActiveRef.current = true;
    } else if (isCurrentlyActive && isActiveRef.current) {
      // 在首页且之前也在首页，恢复动画
      tlRef.current.play();
      isActiveRef.current = true;
    } else {
      // 不在首页，暂停动画
      tlRef.current.pause();
      isActiveRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileCurrentPage, isMobile]);

  return (
    <div className={cn('overflow-hidden', className)} style={{ height: itemHeight }}>
      <div ref={containerRef} className="flex flex-col">
        {items.map((child, index) => (
          <div key={index} className={itemClass} style={{ height: itemHeight }}>
            {child}
          </div>
        ))}
        {slideDown && (
          <div className={itemClass} style={{ height: itemHeight }}>
            {items[0]}
          </div>
        )}
      </div>
    </div>
  );
}
