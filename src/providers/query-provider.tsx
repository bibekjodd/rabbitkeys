'use client';
import { fetchProfile } from '@/queries/useProfile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

type QueryProviderProps = { children: React.ReactNode };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    },
    mutations: { retry: false }
  }
});
export default function QueryProvider({ children }: QueryProviderProps) {
  queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
