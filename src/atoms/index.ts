import { createStore } from 'jotai';

const jotaiStore = createStore();

export * from './nav';
export * from './theme';
export * from './auto-subscribe';

export { jotaiStore };
