import { MouseEvent, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NAV_LIST } from '@/components/nav/nav';
import ScrollDown from '@/components/common/ScrollDown';
import LogoSVG from '@/../public/svgs/logo.svg?component';
import LogoWhiteSVG from '@/../public/svgs/logo-white.svg?component';
import MobileLogoTextSVG from '@/../public/svgs/mobile-logo-text.svg?component';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Vision() {
  const visionRef = useRef<HTMLDivElement>(null);
  const clipVideoRef = useRef<HTMLVideoElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const clipTextRef = useRef<HTMLDivElement>(null);
  const clipPathObj = useRef({ x: 0, y: 0 });
  const { contextSafe } = useGSAP({ scope: visionRef });
  const isMobile = useIsMobile();
  const handleMouseMove = contextSafe((event: MouseEvent<HTMLDivElement>) => {
    if (!clipPathObj.current.x && !clipPathObj.current.y) {
      clipPathObj.current.x = event.clientX;
      clipPathObj.current.y = event.clientY;
    }

    gsap.to(clipPathObj.current, {
      x: event.clientX,
      y: event.clientY,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        if (!clipVideoRef.current || !clipTextRef.current) return;
        const { x, y } = clipPathObj.current;
        const videoRect = clipVideoRef.current.getBoundingClientRect();
        const textRect = clipTextRef.current.getBoundingClientRect();
        clipVideoRef.current.style.clipPath = `circle(${isMobile ? 80 : 180}px at ${x - videoRect.left}px ${y - videoRect.top}px)`;
        clipTextRef.current.style.clipPath = `circle(${isMobile ? 80 : 180}px at ${x - textRect.left}px ${y - textRect.top}px)`;
      },
    });
  });

  const handleVideoPlay = () => {
    if (!backVideoRef.current) return;
    if (!clipVideoRef.current) return;
    const diff = Math.abs(backVideoRef.current.currentTime - clipVideoRef.current.currentTime);
    if (diff < 0.2) return;
    clipVideoRef.current.currentTime = backVideoRef.current.currentTime;
  };

  return (
    <div
      ref={visionRef}
      id={NAV_LIST[0].id}
      onMouseEnter={handleVideoPlay}
      onMouseMove={(event) => handleMouseMove(event)}
      className="page-container page-height"
    >
      <video
        ref={backVideoRef}
        className="absolute left-0 top-0 h-full w-full object-cover mobile:top-[11.125rem] mobile:h-[calc(100%_-_11.125rem)]"
        src="https://cdn.id.life/vision-01.webm"
        poster="/imgs/vision.jpg"
        autoPlay
        playsInline
        muted
        loop
      />
      <video
        ref={clipVideoRef}
        className="fore-hide absolute left-0 top-0 h-full w-full object-cover mobile:top-[12.125rem] mobile:h-[calc(100%_-_12.125rem)]"
        src="https://cdn.id.life/vision-back-01.webm"
        autoPlay
        playsInline
        muted
        loop
      />
      <div className="vision-title">
        <div className="flex-center gap-[1.3125rem]">
          {isMobile ? (
            <MobileLogoTextSVG className="h-10.5" />
          ) : (
            <>
              <LogoSVG className="h-15.5 mobile:h-10.5" />
              <h2 className="text-[3.5rem]/[3.875rem] text-red-600">IMMORTAL DRAGONS</h2>
            </>
          )}
        </div>
        <h2 className="mt-0.5 whitespace-pre-wrap mobile:mt-6">Til Unlimited {isMobile ? '\n' : ''}Human Healthy Lifespan</h2>
        <img className="absolute left-0 top-0 w-6 mobile:w-3" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute right-0 top-0 w-6 rotate-90 mobile:w-3" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute bottom-0 left-0 w-6 -rotate-90 mobile:w-3" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute bottom-0 right-0 w-6 rotate-180 mobile:w-3" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
      </div>
      {/* 移动端不会触发文字裁剪效果 */}
      <div ref={clipTextRef} className="vision-title fore-hide text-white mobile:hidden">
        <div className="flex-center gap-[1.3125rem]">
          {isMobile ? (
            <MobileLogoTextSVG className="h-10.5" />
          ) : (
            <>
              <LogoWhiteSVG className="h-15.5 mobile:h-10.5" />
              <h2 className="text-[3.5rem]/[3.875rem]">IMMORTAL DRAGONS</h2>
            </>
          )}
        </div>
        <h2 className="mt-0.5 whitespace-pre-wrap mobile:mt-6">Til Unlimited {isMobile ? '\n' : ''}Human Healthy Lifespan</h2>
      </div>
      <ScrollDown />
    </div>
  );
}
