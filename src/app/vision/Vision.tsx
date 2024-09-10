import { MouseEvent, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NAV_LIST } from '@/components/nav/nav';
import ScrollDown from '@/components/common/ScrollDown';

export default function Vision() {
  const visionRef = useRef<HTMLDivElement>(null);
  const clipVideoRef = useRef<HTMLVideoElement>(null);
  const clipTextRef = useRef<HTMLDivElement>(null);
  const clipPathObj = useRef({ x: 0, y: 0 });
  const { contextSafe } = useGSAP({ scope: visionRef });

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
        clipVideoRef.current.style.clipPath = `circle(200px at ${x - videoRect.left}px ${y - videoRect.top}px)`;
        clipTextRef.current.style.clipPath = `circle(200px at ${x - textRect.left}px ${y - textRect.top}px)`;
      },
    });
  });

  return (
    <div
      ref={visionRef}
      id={NAV_LIST[0].id}
      onMouseMove={(event) => handleMouseMove(event)}
      className="page-container page-height"
    >
      <video
        className="absolute left-0 top-0 h-full w-full object-cover"
        src="/assets/vision.webm"
        poster="/img/vision.jpg"
        autoPlay
        muted
        loop
      />
      <video
        ref={clipVideoRef}
        className="fore-hide left-0 top-0 h-full w-full object-cover"
        src="/assets/vision-back.webm"
        autoPlay
        muted
        loop
      />
      <div className="vision-title">
        <h2>To Extend</h2>
        <h2>Human Healthy Lifespan</h2>
        <p className="font-migrena text-2xl/10 font-semibold uppercase">
          Knowledge as core competency / Longevity industry is learnable
        </p>
        <img className="absolute left-0 top-0 w-6" src="/svg/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute right-0 top-0 w-6 rotate-90" src="/svg/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute bottom-0 left-0 w-6 -rotate-90" src="/svg/arrow-mark.svg" alt="arrow-mark" />
        <img className="absolute bottom-0 right-0 w-6 rotate-180" src="/svg/arrow-mark.svg" alt="arrow-mark" />
      </div>
      <div ref={clipTextRef} className="vision-title fore-hide text-white">
        <h2>To Extend</h2>
        <h2>Human Healthy Lifespan</h2>
        <p className="font-migrena text-2xl/10 font-semibold uppercase">
          Knowledge as core competency / Longevity industry is learnable
        </p>
      </div>
      <ScrollDown />
    </div>
  );
}
