import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const resultsKey = ['results'];

export const useResults = () => {
  return useInfiniteQuery({
    queryKey: resultsKey,
    queryFn: ({ pageParam, signal }) => fetchResults({ cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(lastPage.length - 1)?.createdAt;
    }
  });
};

type Options = { cursor: string | undefined; signal: AbortSignal };
const fetchResults = async ({ cursor, signal }: Options): Promise<Result[]> => {
  try {
    const url = new URL(`${backendUrl}/api/results`);
    url.searchParams.set('limit', '10');
    if (cursor) url.searchParams.set('cursor', cursor);
    const { data } = await axios.get<{ results: Result[] }>(url.href, {
      withCredentials: true,
      signal
    });
    return data.results;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
