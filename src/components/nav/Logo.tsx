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

  // 使用 useGSAP contextSafe 来确保动画在正确的 GSAP 上下文中执行
  const { contextSafe } = useGSAP();

  const switchLogo = contextSafe(() => {
    if (currentLogoRef.current === LogoType.EN) {
      const logoEn = document.querySelector('#logo-en');
      const logoCn = document.querySelector('#logo-cn');
      if (logoEn && logoCn) {
        gsap.to(logoEn, { opacity: 0, duration: 0.5 });
        gsap.to(logoCn, { opacity: 1, duration: 0.5 });
        currentLogoRef.current = LogoType.CN;
      }
    } else {
      const logoEn = document.querySelector('#logo-en');
      const logoCn = document.querySelector('#logo-cn');
      if (logoEn && logoCn) {
        gsap.to(logoCn, { opacity: 0, duration: 0.5 });
        gsap.to(logoEn, { opacity: 1, duration: 0.5 });
        currentLogoRef.current = LogoType.EN;
      }
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
    <div className="relative h-10 w-55" onClick={handleClick}>
      <div id="logo-en" className="absolute left-0 top-0 h-full opacity-0 mobile:top-1/2 mobile:h-5 mobile:-translate-y-1/2">
        <LogoSVGen className="h-full cursor-pointer" />
      </div>
      <div id="logo-cn" className="absolute left-0 top-1/2 h-8 -translate-y-1/2 mobile:h-5">
        <LogoSVGcn className="h-full cursor-pointer" />
      </div>
    </div>
  );
}
