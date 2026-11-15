import { createStore } from 'jotai';

/**
 * The app's one jotai store. In its own module so the root provider imports only the store: importing it from
 * the atoms barrel (src/atoms/index.ts) pulled every atom module, and through atoms/theme the experience's
 * constants/config.tsx (about 11 KB gzip), into the first load of every page.
 */
export const jotaiStore = createStore();
