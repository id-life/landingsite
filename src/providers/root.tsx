'use client';

import React, { PropsWithChildren, JSX } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { JotaiStoreProvider } from '@/providers/jotai-provider';
import { ProviderComposer } from '@/components/common/ProviderComposer';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, ScrollToPlugin, DrawSVGPlugin);
const contexts: JSX.Element[] = [<JotaiStoreProvider key="jotaiStoreProvider" />];

export default function Providers({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={contexts}>{children}</ProviderComposer>;
}
