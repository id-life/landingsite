import { atom } from 'jotai';

export type ModelType = 'CLONE_01' | 'CLONE_02' | 'CLONE_03';

export const currentModelAtom = atom<ModelType>('CLONE_01'); 