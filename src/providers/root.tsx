'use client';

import { ProviderComposer } from '@/components/common/ProviderComposer';
import { JotaiStoreProvider } from '@/providers/jotai-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { JSX, PropsWithChildren } from 'react';

// GSAP and its plugins are registered by the experience (src/utils/gsap-plugins.ts), not here: the root
// providers wrap every page, and content pages use no GSAP plugin.

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
