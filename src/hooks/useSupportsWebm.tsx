import { useEffect, useMemo, useState } from 'react';
import { ALPHA_CLIPS_BASE } from '@/constants/media';
import { alphaClipUrl, type AlphaClipFormat, detectAlphaClipFormat } from '@/lib/alpha-clips';

/**
 * The transparent clips (Digital Twin, Presence map cards): whether this browser plays them, and the address to play
 * each from. The format is the one this browser draws with its transparency (VP9 or HEVC with alpha), found by drawing
 * a tiny clip (detectAlphaClipFormat), never from the user agent (RWD-10). With ALPHA_CLIPS_BASE set, the re-encoded
 * file of that format is played, so iOS Safari plays them too. With it unset, the original addresses are played, and
 * they are VP9 with alpha: playable only where VP9 transparency is drawn. Until the format is known (a few
 * milliseconds after mount) the still image stands in, as it does where neither format works.
 */
export function useAlphaClips(): { playable: boolean; url: (original: string) => string } {
  const [format, setFormat] = useState<AlphaClipFormat>(null);
  useEffect(() => {
    let live = true;
    detectAlphaClipFormat().then((f) => live && setFormat(f));
    return () => {
      live = false;
    };
  }, []);
  return useMemo(
    () =>
      ALPHA_CLIPS_BASE
        ? { playable: format !== null, url: (original: string) => alphaClipUrl(original, format) }
        : { playable: format === 'vp9a', url: (original: string) => original },
    [format],
  );
}
