import { BACKGROUND_THEME, BackgroundTheme } from '@/constants/config';
import { atom } from 'jotai';

// 当前主题状态
export const mobileCurrentThemeAtom = atom<BackgroundTheme>(BACKGROUND_THEME.LIGHT);

// 主题切换中状态
export const mobileThemeTransitioningAtom = atom<boolean>(false);
