import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useInvitePlayer = ({ player, trackId }: Options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['invite-player', trackId, player],
    mutationFn: () => invitePlayer({ trackId, player }),
    gcTime: 10_000,
    onError() {
      queryClient.invalidateQueries({ queryKey: ['track'] });
    }
  });
};

type Options = { player: string; trackId: string };
const invitePlayer = async ({ trackId, player }: Options) => {
  try {
    return axios.get(`${backend_url}/api/players/${player}/invite/${trackId}`, {
      withCredentials: true
    });
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
