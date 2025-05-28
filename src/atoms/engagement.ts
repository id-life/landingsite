import { atom } from 'jotai';

// 存储当前展开的书籍点的索引，如果为null则表示没有展开的项
export const activeBookDotAtom = atom<number | null>(null);
export const activeBookDotClickOpenAtom = atom<boolean>(false);

// 存储当前展开的书籍点的索引，如果为null则表示没有展开的项
export const activeSponsorDotAtom = atom<number | null>(null);
export const activeSponsorDotClickOpenAtom = atom<boolean>(false);

export const activeMeetingDotAtom = atom<number | null>(null);
export const activeMeetingDotClickOpenAtom = atom<boolean>(false);

// 是否是移动端从 spectrum 跳转过来的
export const isMobileEngagementJumpAtom = atom<boolean>(false);

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
