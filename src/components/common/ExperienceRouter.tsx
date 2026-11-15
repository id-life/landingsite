'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_LIST } from '@/components/nav/nav';

// HashRouter and what it pulls in (the navigation hooks, GSAP and its plugins) load only once the visitor is
// on the experience, so content pages (/news, /podcast, articles) do not download them.
const HashRouter = dynamic(() => import('@/components/common/HashRouter'), { ssr: false });

const EXPERIENCE_PATHS = new Set(NAV_LIST.map((item) => item.href));

/**
 * Rendered in the root layout. It mounts HashRouter the first time the pathname is an experience URL and
 * keeps it mounted from then on, so HashRouter still never unmounts once the experience has been visited
 * (it handles the return from a content page; see its own comment).
 */
export default function ExperienceRouter() {
  const pathname = usePathname();
  const [needed, setNeeded] = useState(false);
  // Updated while rendering (React's pattern for state derived from a changing value), not in an effect.
  if (!needed && EXPERIENCE_PATHS.has(pathname)) setNeeded(true);

  return needed ? <HashRouter /> : null;
}
