import { mobileCurrentPageAtom } from '@/atoms';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { shuffle } from 'lodash-es';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { NAV_LIST } from '../nav/nav';

interface VerticalCarouselProps {
  children: ReactNode[];
  className?: string;
  itemHeight?: number; // 每个项目的高度(px)
  duration?: number; // 停留时间(秒)
  transition?: number; // 过渡时间(秒)
  slideDown?: boolean; // 添加新属性：控制最后一个的时候是否向下滑动
  isShuffle?: boolean; // 添加新属性：是否打乱顺序
  itemClassName?: string;
}

export default function VerticalCarousel({
  children,
  className,
  itemHeight = 45,
  duration = 3,
  transition = 0.6,
  slideDown = false, // 添加新参数
  isShuffle = false, // 添加默认值
  itemClassName,
}: VerticalCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();
  const itemClass = useMemo(() => {
    return cn('mobile:flex mobile:flex-col mobile:items-center mobile:justify-center', itemClassName);
  }, [itemClassName]);
  const isMobile = useIsMobile();
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);
  const items = useMemo(() => {
    if (!isMounted) return children;
    let result = [...children];
    if (isShuffle) {
      result = shuffle(result);
    }
    return slideDown ? result.concat(result?.length ? result[0] : []) : result;
  }, [children, isMounted, isShuffle, slideDown]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    tlRef.current = gsap.timeline({ repeat: -1 });
    const tl = tlRef.current;
    const elements = containerRef.current.children;

    // 如果是移动端且不在首页，暂停动画
    if (isMobile && mobileCurrentPage.id !== NAV_LIST[0]?.id) {
      tl.pause();
    }

    if (slideDown) {
      // 向下滑动的动画逻辑
      items.forEach((_, index) => {
        if (index === items.length - 1) {
          tl.to(
            elements[index - 1],
            {
              opacity: 0,
              duration: transition / 2,
              ease: 'power2.inOut',
            },
            '<',
          )
            .to(
              containerRef.current,
              {
                y: `-${index * itemHeight}px`,
                opacity: 1,
                duration: transition,
                ease: 'power2.inOut',
              },
              '<',
            )
            .set(containerRef.current, {
              y: 0, // 移动到复制的第一个元素位置
            });
        } else {
          // 其他元素的正常动画
          const isFadeInElement = slideDown && index !== 0;
          if (isFadeInElement)
            tl.to(
              elements[index - 1],
              {
                opacity: 0,
                duration: transition / 2,
                ease: 'power2.inOut',
              },
              '<',
            );
          tl.to(
            containerRef.current,
            {
              opacity: 1,
              y: `-${index * itemHeight}px`,
              duration: transition,
              ease: 'power2.inOut',
            },
            isFadeInElement ? '<' : undefined,
          ).to(containerRef.current, {
            duration: duration,
          });
        }
      });
    } else {
      // 原来的向上滑动逻辑
      items.forEach((_, index) => {
        tl.to(containerRef.current, {
          y: `-${index * itemHeight}px`,
          duration: transition,
          ease: 'power2.inOut',
        }).to(containerRef.current, {
          duration: duration,
        });
      });

      // 回到第一个
      tl.to(containerRef.current, {
        y: 0,
        duration: transition,
        ease: 'power2.inOut',
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
