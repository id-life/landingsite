'use client';

import { STORAGE_KEY } from '@/constants/storage';
import { atomWithStorage } from 'jotai/utils';

export const hasShownAutoSubscribeAtom = atomWithStorage<boolean>(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED, false);
