'use client';

import { ProviderComposer } from '@/components/common/ProviderComposer';
import { JotaiStoreProvider } from '@/providers/jotai-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { JSX, PropsWithChildren } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, ScrollToPlugin, DrawSVGPlugin, SplitText, MotionPathPlugin);

// Scroll restoration is set per mount of the experience (hooks/useExperienceLifecycle.ts): 'manual' inside
// the 3D experience, the browser's 'auto' on content pages. Setting it here, at module scope, made 'manual'
// stick on every route, so Back from a podcast episode landed at the top of /podcast.

const contexts: JSX.Element[] = [
  <JotaiStoreProvider key="jotaiStoreProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
];

export default function Providers({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={contexts}>{children}</ProviderComposer>;
}
