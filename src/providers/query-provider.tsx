'use client';
import { fetchActivePlayers } from '@/queries/use-active-players';
import { fetchParagraph } from '@/queries/use-paragraph';
import { fetchProfile } from '@/queries/use-profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

type QueryProviderProps = { children: React.ReactNode };

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false
          },
          mutations: { retry: false }
        }
      })
  );
  queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  queryClient.prefetchQuery({
    queryKey: ['paragraph', null],
    queryFn: () => fetchParagraph(null),
    retry: 2
  });
  queryClient.prefetchQuery({
    queryKey: ['active-players'],
    queryFn: () => fetchActivePlayers('')
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
    </QueryClientProvider>
  );
}
