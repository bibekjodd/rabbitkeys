import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { trackKey } from '@/queries/use-track';
import { switchMode } from '@/store/use-game-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchParagraph, paragraphKey } from '../queries/use-paragraph';

export const createTrackKey = ['create-track'];

export const useCreateTrack = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: createTrackKey,
    mutationFn: createTrack,
    onMutate() {
      toast.dismiss();
      toast.loading('Creating track...');
      queryClient.removeQueries({ queryKey: trackKey });
    },
    onSuccess(track) {
      toast.dismiss();
      queryClient.setQueryData(trackKey, track);
      queryClient.prefetchQuery({
        queryKey: paragraphKey(track.paragraphId),
        queryFn: ({ signal }) => fetchParagraph({ paragraphId: track.paragraphId, signal })
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
    const { data } = await axios.post(`${backendUrl}/api/tracks`, {}, { withCredentials: true });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
