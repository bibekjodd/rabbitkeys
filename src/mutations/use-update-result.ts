import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useTypingStore } from '@/store/use-typing-store';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-result'],
    mutationFn: async () => {
      const profile = queryClient.getQueryData<User>(['profile']);
      if (!profile) return;
      return updateResult();
    },
    onSuccess(result) {
      if (!result) return;
      const results = queryClient.getQueryData<InfiniteData<Result[]>>(['results']) || {
        pages: [],
        pageParams: []
      };
      const [firstPage, ...restPages] = results.pages;
      const updatedFirstPage: Result[] = [result, ...(firstPage || [])];
      queryClient.setQueryData<InfiniteData<Result[]>>(['results'], {
        ...results,
        pages: [updatedFirstPage, ...restPages]
      });
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
};

const updateResult = async (): Promise<Result> => {
  try {
    const { speed, accuracy, topSpeed } = useTypingStore.getState();
    const { data } = await axios.post(
      `${backend_url}/api/results`,
      { speed, accuracy, topSpeed },
      { withCredentials: true }
    );
    return data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
