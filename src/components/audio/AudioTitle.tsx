import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type MusicTitleProps = {
  width?: number;
  title?: string;
};

function AudioTitle({ width, title }: MusicTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (!wrapperRef.current || !containerRef.current) return;
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    const titleWidth = wrapper.clientWidth;
    const containerWidth = container.clientWidth;

    if (titleWidth > containerWidth) {
      const diff = titleWidth - containerWidth;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.fromTo(
        wrapper,
        { x: 0 },
        {
          x: -diff,
          duration: diff / 30,
          ease: 'linear',
          delay: 1,
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
        animationRef.current.kill();
      }
    };
  }, [title]);

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: width ?? 'auto' }}
      className="overflow-hidden text-[12px]/[14px] font-semibold text-background"
    >
      <div ref={wrapperRef} className="inline-block text-nowrap">
        {title}
      </div>
    </div>
  );
}

export default React.memo(AudioTitle);
