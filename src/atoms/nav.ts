import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

export const currentPageAtom = atom<NavItem>(NAV_LIST[0]);

export const currentPageIndexAtom = selectAtom(currentPageAtom, (page) => NAV_LIST.findIndex((item) => item.id === page.id));

export const mobileNavOpenAtom = atom<boolean>(false);

export const navigateToAtom = atom<NavItem | null>(null);
