import { cn } from '@/utils';
import gsap from 'gsap';
import { ReactNode, useEffect, useMemo, useRef } from 'react';

interface VerticalCarouselProps {
  children: ReactNode[];
  className?: string;
  itemHeight?: number; // 每个项目的高度(px)
  duration?: number; // 停留时间(秒)
  transition?: number; // 过渡时间(秒)
  slideDown?: boolean; // 添加新属性：控制最后一个的时候是否向下滑动
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

  const itemClass = useMemo(() => {
    return cn('mobile:flex mobile:flex-col mobile:items-center mobile:justify-center', itemClassName);
  }, [itemClassName]);

  const items = useMemo(
    () => (slideDown ? children.concat(children?.length ? children[0] : []) : children),
    [slideDown, children],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });
    const elements = containerRef.current.children;
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
      tl.kill();
    };
  }, [items, itemHeight, duration, transition, slideDown]);

  return (
    <div className={cn('overflow-hidden', className)} style={{ height: itemHeight }}>
      <div ref={containerRef} className="flex flex-col">
        {children.map((child, index) => (
          <div key={index} className={itemClass} style={{ height: itemHeight }}>
            {child}
          </div>
        ))}
        {slideDown && (
          <div className={itemClass} style={{ height: itemHeight }}>
            {children[0]}
          </div>
        )}
      </div>
    </div>
  );
}
