import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { fetchParagraph } from '../queries/useParagraph';

export const useStartRace = () => {
  const startGame = useGameStore((state) => state.startGame);
  const clearGame = useGameStore((state) => state.clearGame);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['start-race'],
    mutationFn: startRace,
    async onSuccess(track) {
      queryClient.setQueryData(['track'], track);
      await startGame();
      queryClient.prefetchQuery({
        queryKey: ['paragraph', track.nextParagraphId],
        queryFn: () => fetchParagraph(track.nextParagraphId)
      });
    },
    onError(err) {
      clearGame();
      toast.error(`Could not start race. ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['track'] });
    }
  });
};

const startRace = async (trackId: string): Promise<Track> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/race/${trackId}`, {
      withCredentials: true
    });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
