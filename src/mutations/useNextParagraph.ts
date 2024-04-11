import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useNextParagraph = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['next-paragraph'],
    mutationFn: (currentParagraphId: string) => fetchNextParagraph(currentParagraphId),
    onSuccess(data) {
      queryClient.setQueryData(['paragraph', 'next'], data);
    }
  });
};

const fetchNextParagraph = async (skipParagraphId: string): Promise<Paragraph> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/paragraph?skip=${skipParagraphId}`);
    return data.paragraph;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
