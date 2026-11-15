'use client';

import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { globalLoadedAtom } from '@/atoms/geo';
import { experienceModeAtom } from '@/hooks/useExperienceMode';
import { cn } from '@/utils';
import LogoEnSVG from '@/../public/svgs/logo-en.svg?component';
import TaglineSVG from '@/../public/svgs/main-description.svg?component';

/**
 * The hero as plain DOM (ENG-02, VIS-03): the IMMORTAL DRAGONS wordmark and the tagline, drawn from the same vector
 * files as the WebGL hero and laid out where the WebGL planes sit, on a full-viewport layer exactly like the hero
 * canvas. Rendered by HomeEntry outside the client-only 3D tree, so it is in the server HTML:
 * - first paint: the wordmark is on screen before any JavaScript or WebGL;
 * - healthy WebGL: it fades out once the 3D hero is ready (the loader covers the hand-over);
 * - no WebGL ('static'), a lost hero context or a failed hero scene ('poster'): it stays, and is the hero.
 *
 * Interim art direction from existing assets only; the designed poster is a VIS deliverable (owner ask).
 *
 * Layout: the desktop tree fits a 3.1-high wordmark plane (aspect 277:58) to the frustum: 28.4 % of the viewport
 * height when that fits, else 86 % of the width (heroFit.ts). A viewBox of 1577 x 1000 with "meet" scaling gives
 * exactly that rule: 1577 / 1000 is the aspect at which both limits meet. The tagline sits 3.5 units below the
 * wordmark centre (CenterLogo.tsx). The phone tree's wordmark spans 86 % of the width with its tagline nearer
 * (MobileCenterLogo.tsx); its layer is the 390 x 844 composition, width-fitted.
 */
export default function HeroPoster() {
  const mode = useAtomValue(experienceModeAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  // Mission is the only section whose URL is '/' (the experience keeps the address bar on the visible section).
  const onHero = usePathname() === '/';
  const shown = onHero && (mode !== 'full' || !globalLoaded);

  return (
    <div
      id="hero-poster"
      aria-hidden={shown ? undefined : true}
      className={cn(
        'pointer-events-none fixed inset-0 z-[1] transition-[opacity,visibility] duration-300 motion-reduce:transition-none',
        shown ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <svg
        role="img"
        aria-label="Immortal Dragons 不朽真龙"
        className="block size-full mobile:hidden"
        viewBox="0 0 1577 1000"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Immortal Dragons 不朽真龙</title>
        <LogoEnSVG x={110.25} y={358} width={1356.5} height={284} />
        <TaglineSVG x={512.7} y={809.2} width={551.6} height={22.9} />
      </svg>
      <svg
        role="img"
        aria-label="Immortal Dragons 不朽真龙"
        className="hidden size-full mobile:block"
        viewBox="0 0 1000 2164"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Immortal Dragons 不朽真龙</title>
        <LogoEnSVG x={70} y={992} width={860} height={180} />
        <TaglineSVG x={225} y={1288.5} width={550} height={22.9} />
      </svg>
    </div>
  );
}
