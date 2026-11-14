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

// The app moves the page itself (section stepping, Back / Forward in HashRouter). ScrollTrigger records the
// browser's scroll-restoration mode when it registers ('auto' here) and writes it back on every refresh, which
// silently undid ScrollBehavior's 'manual': Back then restored the stale offset the browser saved at pushState
// time (landing on y=1350 instead of the hero). Telling ScrollTrigger the mode keeps it 'manual'.
if (typeof window !== 'undefined') ScrollTrigger.clearScrollMemory('manual');

const contexts: JSX.Element[] = [
  <JotaiStoreProvider key="jotaiStoreProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
];

export default function Providers({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={contexts}>{children}</ProviderComposer>;
}
