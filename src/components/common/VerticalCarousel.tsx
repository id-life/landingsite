import { mobileCurrentPageAtom } from '@/atoms';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { shuffle } from 'lodash-es';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { NAV_LIST } from '../nav/nav';
import { isCharacterRelationShowAtom } from '@/atoms/character-relation';

interface VerticalCarouselProps {
  children: ReactNode[];
  className?: string;
  itemHeight?: number; // 每个项目的高度(px)
  duration?: number; // 停留时间(秒)
  transition?: number; // 过渡时间(秒)
  slideDown?: boolean; // 控制最后一个的时候是否向下滑动
  itemClassName?: string;
}

export default function VerticalCarousel({
  children,
  className,
  itemHeight = 45,
  duration = 3,
  transition = 0.6,
  slideDown = false, // 添加新参数
  itemClassName,
}: VerticalCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();
  const itemClass = useMemo(() => {
    return cn('mobile:flex mobile:flex-col mobile:items-center mobile:justify-center', itemClassName);
  }, [itemClassName]);
  const isMobile = useIsMobile();
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);
  const isCharacterRelationShow = useAtomValue(isCharacterRelationShowAtom);

  const items = useMemo(() => {
    if (!isMounted) return children;
    let result = [...children];
    result = shuffle(result);
    // 不再需要在items中添加额外的第一个元素，我们将在渲染时处理
    return result;
  }, [children, isMounted]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    tlRef.current = gsap.timeline({
      repeat: -1,
      smoothChildTiming: true, // 确保子动画平滑过渡
    });
    const tl = tlRef.current;
    const elements = containerRef.current.children;
    const totalItems = items.length;

    // 如果是移动端且不在首页，暂停动画
    if (isMobile && mobileCurrentPage.id !== NAV_LIST[0]?.id) {
      tl.pause();
    }

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
              ease: 'power2.inOut',
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
            ease: 'power2.inOut',
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
          ease: 'power2.inOut',
        },
        'loop-start',
      );

      // 容器平滑移动到克隆的第一个元素位置
      tl.to(
        containerRef.current,
        {
          y: `-${totalItems * itemHeight}px`,
          duration: transition,
          ease: 'power2.inOut',
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
          ease: 'power2.inOut',
        }).to(containerRef.current, {
          duration: duration,
        });
      });

      // 回到第一个，带有平滑过渡
      tl.to(containerRef.current, {
        y: `-${totalItems * itemHeight}px`,
        duration: transition,
        ease: 'power2.inOut',
        onComplete: () => {
          // 动画完成后立即重置位置到顶部，但不显示这个过程
          if (containerRef.current) {
            gsap.set(containerRef.current, { y: 0 });
          }
        },
      });
    }

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [items, itemHeight, duration, transition, slideDown, isMobile, mobileCurrentPage]);

  // 监听页面变化，控制动画
  useEffect(() => {
    if (!isMobile || !tlRef.current || !mobileCurrentPage) return;

    if (mobileCurrentPage.id === NAV_LIST[0].id) {
      tlRef.current.play();
    } else {
      tlRef.current.pause();
    }
  }, [mobileCurrentPage, isMobile]);

  return (
    <div className={cn('overflow-hidden', className, isCharacterRelationShow && 'z-[51]')} style={{ height: itemHeight }}>
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
