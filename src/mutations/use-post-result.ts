import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { resultsKey } from '@/queries/use-results';
import { useTypingStore } from '@/store/use-typing-store';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const postResultKey = ['post-result'];

export const usePostResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: postResultKey,
    mutationFn: async () => {
      const profile = queryClient.getQueryData<User>(profileKey);
      if (!profile) return null;
      return postResult();
    },
    onSuccess(result) {
      if (!result) return;
      const results = queryClient.getQueryData<InfiniteData<Result[]>>(resultsKey) || {
        pages: [],
        pageParams: []
      };
      const [firstPage, ...restPages] = results.pages;
      const updatedFirstPage: Result[] = [result, ...(firstPage || [])];
      queryClient.setQueryData<InfiniteData<Result[]>>(resultsKey, {
        ...results,
        pages: [updatedFirstPage, ...restPages]
      });
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: profileKey });
    }
  });
};

const postResult = async (): Promise<Result> => {
  try {
    const { speed, accuracy, topSpeed } = useTypingStore.getState();
    const { data } = await axios.post<{ result: Result }>(
      `${backendUrl}/api/results`,
      { speed, accuracy, topSpeed },
      { withCredentials: true }
    );
    return data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
