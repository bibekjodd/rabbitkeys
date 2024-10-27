'use client';
import { getQueryClient } from '@/lib/query-client';
import { fetchParagraph, paragraphKey } from '@/queries/use-paragraph';
import { fetchProfile, profileKey } from '@/queries/use-profile';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

type QueryProviderProps = { children: React.ReactNode };

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

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
