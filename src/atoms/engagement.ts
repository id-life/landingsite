import { atom } from 'jotai';

// 存储当前展开的书籍点的索引，如果为null则表示没有展开的项
export const activeBookDotAtom = atom<number | null>(null);
export const activeBookDotClickOpenAtom = atom<boolean>(false);

// 存储当前展开的书籍点的索引，如果为null则表示没有展开的项
export const activeSponsorDotAtom = atom<number | null>(null);
export const activeSponsorDotClickOpenAtom = atom<boolean>(false);

export const activeMeetingDotAtom = atom<number | null>(null);
export const activeMeetingDotClickOpenAtom = atom<boolean>(false);

/**
 * The card the phone's tour opened itself, while it is still the open one and the visitor has not tapped since. A tap
 * on that card's point keeps it open (the tour stops) instead of closing it: the visitor did not open it, and the tour
 * may open it in the very instant of the tap (taps on Oxford, London and Aix, the tour's 2nd to 4th cards, were lost).
 */
export const tourOpenedDotAtom = atom<{ type: 'meeting' | 'book' | 'sponsor'; index: number } | null>(null);

// 移动端地图滚动进度 (0-1)
export const mobileMapScrollProgressAtom = atom<number>(0);

// 切换点的展开状态的函数
export const toggleDotIndex = (index: number, currentActive: number | null) => {
  if (currentActive === index) {
    // 如果点击的是当前已经激活的点，则关闭它
    return null;
  } else {
    // 否则激活点击的点
    return index;
  }
};
