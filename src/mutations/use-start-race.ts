import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { trackKey } from '@/queries/use-track';
import { clearGame, startGame } from '@/store/use-game-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { fetchParagraph, paragraphKey } from '../queries/use-paragraph';

export const startRaceKey = ['start-race'];

export const useStartRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: startRaceKey,
    mutationFn: startRace,
    async onSuccess(track) {
      queryClient.setQueryData(trackKey, track);
      await startGame();
      queryClient.prefetchQuery({
        queryKey: paragraphKey(track.nextParagraphId),
        queryFn: ({ signal }) => fetchParagraph({ paragraphId: track.nextParagraphId, signal })
      });
    },
    onError(err) {
      clearGame();
      toast.error(`Could not start race. ${err.message}`);
      queryClient.invalidateQueries({ queryKey: trackKey });
    }
  });
};

const startRace = async (trackId: string): Promise<Track> => {
  try {
    const { data } = await axios.put(`${backendUrl}/api/tracks/${trackId}/start-race`, undefined, {
      withCredentials: true
    });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
