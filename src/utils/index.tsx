import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};

/**
 * 检测当前浏览器是否为Safari
 * @returns boolean
 */
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const vendor = window.navigator.vendor.toLowerCase();

  return (
    userAgent.includes('safari') &&
    !userAgent.includes('chrome') &&
    !userAgent.includes('android') &&
    !userAgent.includes('firefox') &&
    !userAgent.includes('opera') &&
    vendor.includes('apple')
  );
};

// https://github.com/atomantic/is-ua-webview/blob/main/data/rules.js
export const webviewPatterns = [
  // if it says it's a webview, let's go with that
  'WebView',
  // iOS webview will be the same as safari but missing "Safari"
  '(iPhone|iPod|iPad)(?!.*Safari)',
  // Android Lollipop and Above: webview will be the same as native but it will contain "wv"
  // Android KitKat to Lollipop webview will put Version/X.X Chrome/{version}.0.0.0
  'Android.*(;\\s+wv|Version/\\d.\\d\\s+Chrome/\\d+(\\.0){3})',
  // old chrome android webview agent
  'Linux; U; Android',
];

export function judgeIsWebView(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const webviewRegExp = new RegExp('(' + webviewPatterns.join('|') + ')', 'ig');
  return !!userAgent.match(webviewRegExp);
}

export function getElementOffsetTop(element: HTMLElement | null): number {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}
