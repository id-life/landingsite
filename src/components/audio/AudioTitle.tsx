import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type MusicTitleProps = {
  width?: number;
  title?: string;
};

function AudioTitle({ width, title }: MusicTitleProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.restart();
      animationRef.current.kill();
    }
    if (!wrapperRef.current || !containerRef.current || !titleRef.current) return;
    const wrapper = wrapperRef.current;
    const title = titleRef.current;
    const container = containerRef.current;
    const titleWidth = title.clientWidth;
    const containerWidth = container.clientWidth;

    const children = Array.from(wrapper.children);
    children.forEach((child, index) => {
      if (index > 0) {
        wrapper.removeChild(child);
      }
    });

    if (titleWidth > containerWidth) {
      const clone = title.cloneNode(true);
      wrapper.appendChild(clone);
      const offsetX = titleWidth + 16;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.fromTo(
        wrapper,
        { x: 0 },
        {
          x: -offsetX,
          duration: offsetX / 30,
          ease: 'linear',
          delay: 1.5,
        },
      );
      animationRef.current = tl;
      const pauseAnimation = () => animationRef.current?.pause();
      const resumeAnimation = () => animationRef.current?.play();

      container.addEventListener('mouseenter', pauseAnimation);
      container.addEventListener('mouseleave', resumeAnimation);
      return () => {
        container.removeEventListener('mouseenter', pauseAnimation);
        container.removeEventListener('mouseleave', resumeAnimation);
      };
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.restart();
        animationRef.current.kill();
      }
    };
  }, [title]);

  return (
    <div
      ref={containerRef}
      style={{ width: width ?? 'auto' }}
      className="relative h-[14px] overflow-hidden text-[12px]/[14px] font-semibold text-white"
    >
      <div ref={wrapperRef} className="absolute flex gap-[16px] text-nowrap">
        <div ref={titleRef}>{title}</div>
      </div>
    </div>
  );
}

export default React.memo(AudioTitle);
