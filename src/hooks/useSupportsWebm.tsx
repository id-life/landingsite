import { judgeIsWebView } from '@/utils';
import { useMemo } from 'react';
import { isSafari } from 'react-device-detect';
import { useIsMounted } from './useIsMounted';

/**
 * 检测当前环境是否支持 webm 视频格式
 * @returns boolean - true 表示支持webm，false表示不支持
 */
export const useSupportsWebm = (): boolean => {
  const isMounted = useIsMounted();

  const isWebView = useMemo(() => {
    if (isMounted) return judgeIsWebView();
    return false;
  }, [isMounted]);

  // Safari 和 WebView 环境通常不支持webm格式
  const supportsWebm = !isSafari && !isWebView;

  return supportsWebm;
};
