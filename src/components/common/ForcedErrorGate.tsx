import { type ComponentType, useEffect, useState } from 'react';

type Where = 'route' | 'section' | 'global';
type Hook = ComponentType<{ where: Where }>;

/**
 * The only part of the error-state test hook a non-production build carries on every route: a few hundred bytes that
 * look for "force-error" in the address once mounted and only then import() the hook (./ForcedError, a chunk of its
 * own that no page lists). It renders nothing, adds no Suspense boundary and reads no router state, so the routes stay
 * as static as they were. Mounting after the commit means the address is already the new one on a client navigation.
 * Not a client boundary itself: a server layout renders it through its own one-line 'use client' file
 * (./forced-error-gate/<layout>.tsx, required by that layout only), because a client module that several layouts
 * reference is listed by the framework with the chunks of one of them, which then load on every route.
 */
export default function ForcedErrorGate({ where }: { where: Where }) {
  const [hook, setHook] = useState<{ Component: Hook } | null>(null);
  useEffect(() => {
    if (!window.location.search.includes('force-error')) return;
    void import('./ForcedError').then((module) => setHook({ Component: module.default }));
  }, []);
  return hook ? <hook.Component where={where} /> : null;
}
