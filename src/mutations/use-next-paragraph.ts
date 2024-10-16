import { fetchParagraph, paragraphKey } from '@/queries/use-paragraph';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const nextParagraphKey = ['next-paragraph'];

export const useNextParagraph = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: nextParagraphKey,
    mutationFn: (currentParagraphId: string) =>
      fetchParagraph({ skip: currentParagraphId, signal: undefined, paragraphId: null }),
    onSuccess(data) {
      queryClient.setQueryData(paragraphKey('next'), data);
    },
    gcTime: 5 * 60 * 1000
  });
};
