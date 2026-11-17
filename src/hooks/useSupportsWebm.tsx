import { judgeIsWebView } from '@/utils';
import { useMemo } from 'react';
import { useIsMounted } from './useIsMounted';

/**
 * 检测当前环境是否支持 webm 视频格式
 * @returns boolean - true 表示支持 webm，false 表示不支持
 */
export const useSupportsWebm = (): boolean => {
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
