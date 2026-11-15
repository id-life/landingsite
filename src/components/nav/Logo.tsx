'use client';

import LogoSVGen from '@/components/svg/LogoSVGen';

export enum LogoType {
  EN = 'EN',
  CN = 'CN',
}

/**
 * The header logo: one static wordmark. It used to swap between the English wordmark and the
 * Chinese lockup every 8 s (and on click), so the corner changed language while the page was read.
 * The Chinese lockup (LogoSVGcn) stays in src/components/svg for the /zh locale and the bilingual
 * lockup system (VIS-11).
 */
export default function Logo() {
  return (
    <div className="relative h-10 w-55 mobile:w-auto">
      <div className="absolute left-0 top-0 h-full mobile:top-1/2 mobile:h-5 mobile:-translate-y-1/2">
        <LogoSVGen className="h-full" />
      </div>
    </div>
  );
}
