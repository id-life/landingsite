import { atom } from 'jotai';
import { NAV_LIST, NavItem } from '@/components/nav/nav';

export const currentPageAtom = atom<NavItem>(NAV_LIST[0]);

export const mobileNavOpenAtom = atom<boolean>(false);

export const navigateToAtom = atom<NavItem | null>(null);
