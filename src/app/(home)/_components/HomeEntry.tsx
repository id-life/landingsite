'use client';

import { isNull } from 'lodash-es';
import ClientChunkBoundary from '@/components/common/ClientChunkBoundary';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { useIsMobile } from '@/hooks/useIsMobile';
import { retryImport } from '@/utils/retry-import';
import HeroPoster from '@/components/gl/HeroPoster';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import { type ComponentType, createElement, lazy, Suspense } from 'react';
import '@/utils/gsap-plugins';
import type { Deck } from './Home';

type Chunk = { default: ComponentType };
// One Home for both decks (RWD-02): a change of deck needs no other code.
const loaders = {
  home: () => import('./Home') as Promise<Chunk>,
  canvas: () => import('@/components/gl/ExperienceCanvas') as Promise<Chunk>,
};
// Once a chunk has loaded it renders directly, so switching decks later never suspends (a suspension would show the
// fallback and unmount the canvas).
const loaded: Partial<Record<keyof typeof loaders, ComponentType>> = {};
const load = (key: keyof typeof loaders) =>
  retryImport(loaders[key]).then((chunk) => {
    loaded[key] = chunk.default;
    return chunk;
  });
const lazies = {
  home: lazy(() => load('home')),
  canvas: lazy(() => load('canvas')),
};
// The component used for a chunk is fixed at its first render (a changing type would remount it): the lazy wrapper if
// it was not loaded yet, the module itself if it was preloaded.
const chosen: Partial<Record<keyof typeof loaders, ComponentType>> = {};
const pick = (key: keyof typeof loaders) => (chosen[key] ??= loaded[key] ?? lazies[key]);

// Shared entry of every route that renders the single-page 3D experience.
export default function HomeEntry() {
  const isMobile = useIsMobile();
  // ENG-02: without WebGL no canvas, loader or model mounts; the server-rendered poster is the hero.
  const webgl = useExperienceMode() !== 'static';
  const deck: Deck = isMobile ? 'phone' : 'desktop';

  return (
    <>
      {/* Server-rendered: the hero's first paint, and the hero itself without WebGL (ENG-02, VIS-03). */}
      <HeroPoster />
      {!isNull(isMobile) && (
        <ReactQueryProvider>
          <ClientChunkBoundary>
            {/* One canvas above both decks (RWD-02): a deck change keeps the same <canvas> and WebGL context. The
                canvas and the deck commit together (one Suspense boundary), so the deck's timelines find the canvas
                (Portfolio fades #vision-canvas) and the canvas's intro finds the deck's fixed UI. */}
            <Suspense fallback={null}>
              {/* Module-level components (pick() returns the same one for a chunk on every render). */}
              {webgl && createElement(pick('canvas'))}
              {/* Keyed by deck: a change of deck mounts Home afresh, so nothing of one deck survives into the other. */}
              {createElement(pick('home') as ComponentType<{ deck: Deck }>, { deck, key: deck })}
            </Suspense>
          </ClientChunkBoundary>
        </ReactQueryProvider>
      )}
    </>
  );
}
