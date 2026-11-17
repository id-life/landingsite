import { judgeIsWebView } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { ALPHA_CLIPS_BASE } from '@/constants/media';
import { alphaClipUrl, type AlphaClipFormat, detectAlphaClipFormat } from '@/lib/alpha-clips';
import { useIsMounted } from './useIsMounted';

/**
 * 检测当前环境是否支持 webm 视频格式
 * @returns boolean - true 表示支持 webm，false 表示不支持
 */
const useSupportsWebm = (): boolean => {
  const isMounted = useIsMounted();

  // iOS and in-app web views do not play these webm files. iOS is read from the user agent as the device-detect
  // package did (iPhone, iPad, iPod, and iPadOS, which reports a Mac with touch points), without the package.
  const { isWebView, isIOS } = useMemo(() => {
    if (!isMounted) return { isWebView: false, isIOS: false };
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    return { isWebView: judgeIsWebView(), isIOS: ios };
  }, [isMounted]);

  const supportsWebm = !isIOS && !isWebView;

  return supportsWebm;
};

/**
 * The transparent clips (Digital Twin, Presence map cards): whether this browser plays them, and the address to play
 * each from. While ALPHA_CLIPS_BASE is unset this is exactly useSupportsWebm with the original addresses. Once it is
 * set, the re-encoded files are used and the format is the one this browser draws with its transparency (VP9 or HEVC
 * with alpha), so iOS Safari plays them too; until that is known (a few milliseconds after mount) the still image
 * stands in, as it would if neither format works.
 */
export function useAlphaClips(): { playable: boolean; url: (original: string) => string } {
  const supportsWebm = useSupportsWebm();
  const [format, setFormat] = useState<AlphaClipFormat>(null);
  useEffect(() => {
    if (!ALPHA_CLIPS_BASE) return;
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
        : { playable: supportsWebm, url: (original: string) => original },
    [format, supportsWebm],
  );
}
