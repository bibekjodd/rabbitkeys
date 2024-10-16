import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const paragraphKey = (paragraphId: string | null | undefined) => ['paragraph', paragraphId];

export const useParagraph = (paragraphId: string | undefined | null) => {
  return useQuery({
    queryKey: paragraphKey(paragraphId),
    queryFn: ({ signal }) => fetchParagraph({ paragraphId, signal })
  });
};

type Options = {
  signal: AbortSignal | undefined;
  paragraphId: string | null | undefined;
  skip?: string;
};
export const fetchParagraph = async ({
  signal,
  paragraphId,
  skip
}: Options): Promise<Paragraph> => {
  try {
    const url = new URL(`${backendUrl}/api/paragraphs/${paragraphId || 'random'}`);
    if (skip) url.searchParams.set('skip', skip);
    const { data } = await axios.get<{ paragraph: Paragraph }>(url.href, { signal });
    return data.paragraph;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
