import { PropsWithChildren, useMemo } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reportError } from '@/lib/report';
import React from 'react';

export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        // ENG-08: every failed query and mutation reaches Sentry, tagged with its key (they used to fail silently).
        queryCache: new QueryCache({
          onError: (error, query) => reportError(error, { area: 'query', key: JSON.stringify(query.queryKey).slice(0, 120) }),
        }),
        mutationCache: new MutationCache({
          onError: (error, _vars, _ctx, mutation) =>
            reportError(error, {
              area: 'mutation',
              key: JSON.stringify(mutation.options.mutationKey ?? 'unnamed').slice(0, 120),
            }),
        }),
        defaultOptions: {
          queries: {
            // ENG-08: one retry a second later, then the error state with its retry control. The default (three
            // retries, backing off to 4 s) kept a failed section in its loading or empty state for about 7 s.
            retry: 1,
            retryDelay: 1000,
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
          },
        },
      }),
    [],
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
