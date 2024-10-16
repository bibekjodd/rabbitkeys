import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { trackKey } from '@/queries/use-track';
import { clearGame, switchMode } from '@/store/use-game-store';
import { invalidateParagraph } from '@/store/use-typing-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const leaveTrackKey = ['leave-track'];

export const useLeaveTrack = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: leaveTrackKey,
    mutationFn: leaveTrack,
    onMutate() {
      toast.loading('Leaving track...');
      clearGame();
      invalidateParagraph();
      queryClient.removeQueries({ queryKey: trackKey });
      switchMode({ isMultiplayer: false });
      router.replace('/');
    },
    onSettled(data, err) {
      toast.dismiss();
      if (err) {
        toast.error(err.message);
      }
    }
  });
};

const leaveTrack = async (trackId: string) => {
  try {
    await axios.put(`${backendUrl}/api/tracks/${trackId}/leave`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
