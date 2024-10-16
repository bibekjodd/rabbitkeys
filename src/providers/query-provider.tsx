'use client';
import { fetchParagraph, paragraphKey } from '@/queries/use-paragraph';
import { fetchProfile, profileKey } from '@/queries/use-profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

type QueryProviderProps = { children: React.ReactNode };

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchIntervalInBackground: false,
            gcTime: 5 * 60 * 1000
          },
          mutations: { retry: false, gcTime: 30 * 1000 }
        }
      })
  );
  queryClient.prefetchQuery({ queryKey: profileKey, queryFn: fetchProfile });
  queryClient.prefetchQuery({
    queryKey: paragraphKey(null),
    queryFn: ({ signal }) => fetchParagraph({ paragraphId: null, signal })
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
