'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import LogoSVGen from '@/components/svg/LogoSVGen';
import LogoSVGcn from '@/components/svg/LogoSVGcn';
import { useRef } from 'react';

export enum LogoType {
  EN = 'EN',
  CN = 'CN',
}

export default function Logo() {
  const currentLogoRef = useRef(LogoType.CN);
  const intervalRef = useRef<NodeJS.Timeout>();
  // Refs, not document.querySelector('#logo-en'): with two logos on a page (the experience nav and a tool
  // page header), the id lookup always found the first one, so the visible logo never switched.
  const logoEnRef = useRef<HTMLDivElement>(null);
  const logoCnRef = useRef<HTMLDivElement>(null);

  // 使用 useGSAP contextSafe 来确保动画在正确的 GSAP 上下文中执行
  const { contextSafe } = useGSAP();

  const switchLogo = contextSafe(() => {
    const logoEn = logoEnRef.current;
    const logoCn = logoCnRef.current;
    if (!logoEn || !logoCn) return;
    if (currentLogoRef.current === LogoType.EN) {
      gsap.to(logoEn, { opacity: 0, duration: 0.5 });
      gsap.to(logoCn, { opacity: 1, duration: 0.5 });
      currentLogoRef.current = LogoType.CN;
    } else {
      gsap.to(logoCn, { opacity: 0, duration: 0.5 });
      gsap.to(logoEn, { opacity: 1, duration: 0.5 });
      currentLogoRef.current = LogoType.EN;
    }
  });

  useGSAP(() => {
    intervalRef.current = setInterval(() => switchLogo(), 8000);
  }, []);

  const handleClick = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    switchLogo();
    intervalRef.current = setInterval(() => switchLogo(), 8000);
  };

  return (
    <div className="relative h-10 w-55 mobile:w-auto" onClick={handleClick}>
      <div ref={logoEnRef} className="absolute left-0 top-0 h-full opacity-0 mobile:top-1/2 mobile:h-5 mobile:-translate-y-1/2">
        <LogoSVGen className="h-full cursor-pointer" />
      </div>
      <div ref={logoCnRef} className="absolute left-0 top-1/2 h-8 -translate-y-1/2 mobile:h-5">
        <LogoSVGcn className="h-full cursor-pointer" />
      </div>
    </div>
  );
}
