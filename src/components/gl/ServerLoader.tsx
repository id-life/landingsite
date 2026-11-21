'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { serverLoaderHandedOverAtom } from '@/atoms/loading';
import Background from '@/components/common/Background';
import { LoaderMark } from '@/components/gl/LoaderMark';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import { useIsMounted } from '@/hooks/useIsMounted';

/** As ProgressLoader's fail-open: past it the experience has given up on its loader, and so does this copy. */
const GIVE_UP_MS = 15000;

/** Only the document's first experience renders it: a later client-side return to the experience has no server HTML. */
let documentRendered = false;

/**
 * His loader, in the server HTML (PERF-03): the same overlay, background and mark as ProgressLoader at its first frame
 * (empty bar), drawn at first paint instead of once the experience's script has arrived. It stands until the client's
 * loader is in the document (serverLoaderHandedOverAtom, set in ProgressLoader's layout effect: same commit, before the
 * browser paints), and is never drawn without WebGL (the inline probe's html[data-webgl="0"], globals.css) or without
 * JavaScript (HomeEntry's no-script rule).
 */
export default function ServerLoader() {
  const [first] = useState(() => !documentRendered);
  const handedOver = useAtomValue(serverLoaderHandedOverAtom);
  const mode = useExperienceMode();
  const [gaveUp, setGaveUp] = useState(false);
  // The experience mode is the client's alone (it probes WebGL): the hydrating render matches the server's, and the mode
  // applies from the next one (without WebGL the CSS rule has kept it undrawn meanwhile).
  const hydrated = useIsMounted();
  useEffect(() => {
    documentRendered = true;
    const timer = window.setTimeout(() => setGaveUp(true), GIVE_UP_MS);
    return () => window.clearTimeout(timer);
  }, []);
  if (!first || handedOver || gaveUp || (hydrated && mode !== 'full')) return null;
  return (
    <div
      id="server-loader"
      className="z-[500] grid place-items-center"
      style={{ position: 'fixed', overflow: 'auto', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <Background />
      <LoaderMark gradientId="paint_linear_server" />
    </div>
  );
}
