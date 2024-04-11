import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useParagraph = (paragraphId: string | undefined | null) => {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const isModeDetermined = useGameStore((state) => state.isModeDetermined);

  return useQuery({
    queryKey: ['paragraph', paragraphId || null],
    queryFn: () => fetchParagraph(paragraphId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
};

export const fetchParagraph = async (
  paragraphId: string | null | undefined
): Promise<Paragraph> => {
  try {
    let url: string = `${backend_url}/api/paragraph`;
    if (paragraphId) url += `/${paragraphId}`;
    const { data } = await axios.get(url, {
      withCredentials: true
    });
    return data.paragraph;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
