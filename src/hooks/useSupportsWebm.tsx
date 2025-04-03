import { judgeIsWebView } from '@/utils';
import { useMemo } from 'react';
import { isIOS } from 'react-device-detect';
import { useIsMounted } from './useIsMounted';

/**
 * 检测当前环境是否支持 webm 视频格式
 * @returns boolean - true 表示支持 webm，false 表示不支持
 */
export const useSupportsWebm = (): boolean => {
  const isMounted = useIsMounted();

  const isWebView = useMemo(() => {
    if (isMounted) return judgeIsWebView();
    return false;
  }, [isMounted]);

  // Safari 和 WebView 环境通常不支持 webm 格式
  const supportsWebm = !isIOS && !isWebView;

  return supportsWebm;
};
