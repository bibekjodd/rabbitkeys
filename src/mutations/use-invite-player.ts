import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { trackKey } from '@/queries/use-track';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type KeyOptions = { playerId: string; trackId: string };
export const invitePlayerKey = (options: KeyOptions) => ['invite-player', options];

export const useInvitePlayer = (options: KeyOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: invitePlayerKey(options),
    mutationFn: () => invitePlayer(options),
    gcTime: 10_000,
    onError() {
      queryClient.invalidateQueries({ queryKey: trackKey });
    }
  });
};

const invitePlayer = async ({ trackId, playerId }: KeyOptions) => {
  try {
    return await axios.put(`${backendUrl}/api/tracks/${trackId}/invite/${playerId}`, undefined, {
      withCredentials: true
    });
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
