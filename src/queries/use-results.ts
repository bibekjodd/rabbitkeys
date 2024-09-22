import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useResults = () => {
  return useInfiniteQuery({
    queryKey: ['results'],
    queryFn: ({ pageParam }) => fetchResults({ cursor: pageParam }),
    initialPageParam: new Date().toISOString(),
    getNextPageParam(lastPage, allPages) {
      if (allPages.length >= 10) return undefined;

      return lastPage.at(lastPage.length - 1)?.createdAt;
    }
  });
};

type Options = { cursor?: string };
const fetchResults = async ({ cursor }: Options): Promise<Result[]> => {
  try {
    const url = new URL(`${backend_url}/api/results`);
    url.searchParams.set('limit', '10');
    if (cursor) url.searchParams.set('cursor', cursor);
    const { data } = await axios.get(url.href, { withCredentials: true });
    return data.results;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
