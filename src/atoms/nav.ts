import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

export const currentPageAtom = atom<NavItem>(NAV_LIST[0]);

export const currentPageIndexAtom = selectAtom(currentPageAtom, (page) => NAV_LIST.findIndex((item) => item.id === page.id));

export const mobileNavOpenAtom = atom<boolean>(false);

export const navigateToAtom = atom<NavItem | null>(null);

// 移动端 portfolio 轮播页面进度条
export const mobilePortfolioPageIndexAtom = atom<number>(0);
export const mobilePortfolioPageNavigateToAtom = atom<number | null>(null);

// value 页面进度条
export const valuePageIndexAtom = atom<number>(0);
export const valuePageNavigateToAtom = atom<number | null>(null);

export const isScrollingAtom = atom<boolean>(false);

// 移动端的新逻辑
export const mobileCurrentPageAtom = atom<NavItem>(NAV_LIST[0]);
export const mobileCurrentPageIndexAtom = selectAtom(mobileCurrentPageAtom, (page) =>
  NAV_LIST.findIndex((item) => item.id === page.id),
);
