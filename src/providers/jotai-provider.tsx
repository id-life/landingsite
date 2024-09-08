import { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { jotaiStore } from '@/atoms';

export const JotaiStoreProvider = ({ children }: PropsWithChildren) => {
  return <Provider store={jotaiStore}>{children}</Provider>;
};
