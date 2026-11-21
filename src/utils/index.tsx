import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { typeRoles } from '@/styles/tokens';

// tailwind-merge must know the type roles (and the other custom font sizes in tailwind.config.ts) as font sizes:
// unknown, `text-caption` reads as a colour and a later `text-white` in the same cn() silently removes it (RWD-01).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...Object.keys(typeRoles), 'ss', 'read', 'read-sm', 'read-xs', 'read-lg'] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};

export function getElementOffsetTop(element: HTMLElement | null): number {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}

export function formatKeywords(str?: string) {
  if (!str) return '';
  return str.split(',').map((item) => item.trim().replace(/^'|'$/g, ''));
}
