import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useKickPlayer = ({ trackId, playerId }: Options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['kick-player', trackId, playerId],
    mutationFn: () => kickPlayer({ trackId, playerId }),
    onError(err) {
      toast.dismiss();
      toast.error(`Could not kick player from the track! ${err.message}`);
    },
    onSuccess() {
      const track = queryClient.getQueryData<Track>(['track']);
      if (!track) return;

      const updatedPlayers: Track['players'] = track.players.filter(
        (player) => player.id !== playerId
      );
      const updatedTrack = { ...track, players: updatedPlayers };
      queryClient.setQueryData<Track>(['track'], updatedTrack);
    }
  });
};

type Options = { trackId: string; playerId: string };
const kickPlayer = async ({ trackId, playerId }: Options) => {
  try {
    return axios.get(`${backend_url}/api/players/${playerId}/kick/${trackId}`, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
