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
