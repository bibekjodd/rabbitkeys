import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchParagraph } from '../queries/useParagraph';

export const useCreateTrack = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const switchMode = useGameStore((state) => state.switchMode);

  return useMutation({
    mutationKey: ['create-track'],
    mutationFn: createTrack,
    onMutate() {
      toast.dismiss();
      toast.loading('Creating track...');
      queryClient.removeQueries({ queryKey: ['track'] });
    },
    onSuccess(track) {
      toast.dismiss();
      queryClient.setQueryData(['track'], track);
      queryClient.prefetchQuery({
        queryKey: ['paragraph', track.paragraphId],
        queryFn: () => fetchParagraph(track.paragraphId)
      });
      router.replace(`/?track=${track.id}`);
      switchMode({ isMultiplayer: true, trackId: track.id });
    },
    onError(error) {
      toast.dismiss();
      toast.error(`Could not create track. ${error.message}`);
    }
  });
};

const createTrack = async (): Promise<Track> => {
  try {
    const { data } = await axios.post(`${backend_url}/api/track`, {}, { withCredentials: true });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
