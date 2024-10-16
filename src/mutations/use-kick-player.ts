import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { trackKey } from '@/queries/use-track';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

type Options = { trackId: string; playerId: string };
export const kickPlayerKey = (options: Options) => ['kick-player', options];

export const useKickPlayer = ({ trackId, playerId }: Options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: kickPlayerKey({ trackId, playerId }),
    mutationFn: () => kickPlayer({ trackId, playerId }),
    onError(err) {
      toast.dismiss();
      toast.error(`Could not kick player from the track! ${err.message}`);
    },
    onSuccess() {
      const track = queryClient.getQueryData<Track>(trackKey);
      if (!track) return;

      const updatedPlayers: Track['players'] = track.players.filter(
        (player) => player.id !== playerId
      );
      const updatedTrack = { ...track, players: updatedPlayers };
      queryClient.setQueryData<Track>(trackKey, updatedTrack);
    }
  });
};

const kickPlayer = async ({ trackId, playerId }: Options) => {
  try {
    return await axios.put(`${backendUrl}/api/tracks/${trackId}/kick/${playerId}`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
