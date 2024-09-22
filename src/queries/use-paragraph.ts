import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useParagraph = (paragraphId: string | undefined | null) => {
  return useQuery({
    queryKey: ['paragraph', paragraphId || null],
    queryFn: () => fetchParagraph(paragraphId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 2
  });
};

export const fetchParagraph = async (
  paragraphId: string | null | undefined
): Promise<Paragraph> => {
  try {
    let url: string = `${backend_url}/api/paragraphs`;
    if (paragraphId) url += `/${paragraphId}`;
    const { data } = await axios.get(url, {
      withCredentials: true
    });
    return data.paragraph;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
