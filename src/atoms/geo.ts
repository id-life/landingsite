import { atom } from 'jotai';

export const globalLoadedAtom = atom<boolean>(false);
export const fadeInAnimCompletedAtom = atom<boolean>(false);
export const isLoadingUIAtom = atom<boolean>(false);

export const isCNAtom = atom<boolean>(false);

export const model2VisibleAtom = atom<boolean>(true); // 水母 3/4
export const model3VisibleAtom = atom<boolean>(true); // 小精灵 page 1/2
export const model4VisibleAtom = atom<boolean>(true); // 海马 page 4 之后
