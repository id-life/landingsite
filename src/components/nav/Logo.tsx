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
  const currentLogoRef = useRef(LogoType.EN);
  const intervalRef = useRef<NodeJS.Timeout>();

  function switchLogo() {
    if (currentLogoRef.current === LogoType.EN) {
      gsap.to('#logo-en', { opacity: 0, duration: 0.5 });
      gsap.to('#logo-cn', { opacity: 1, duration: 0.5 });
      currentLogoRef.current = LogoType.CN;
    } else {
      gsap.to('#logo-cn', { opacity: 0, duration: 0.5 });
      gsap.to('#logo-en', { opacity: 1, duration: 0.5 });
      currentLogoRef.current = LogoType.EN;
    }
  }

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
      <LogoSVGen className="absolute left-0 top-0 h-full cursor-pointer mobile:h-5" />
      <LogoSVGcn className="absolute left-0 top-0 h-full cursor-pointer opacity-0 mobile:h-5" />
    </div>
  );
}
