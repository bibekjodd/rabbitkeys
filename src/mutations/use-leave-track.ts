import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useTypingStore } from '@/store/use-typing-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLeaveTrack = () => {
  const router = useRouter();
  const switchMode = useGameStore((state) => state.switchMode);
  const clearGame = useGameStore((state) => state.clearGame);
  const queryClient = useQueryClient();
  const invalidateParagraph = useTypingStore((state) => state.invalidateParagraph);
  return useMutation({
    mutationKey: ['leave-track'],
    mutationFn: leaveTrack,
    onMutate() {
      toast.loading('Leaving track...');
      clearGame();
      invalidateParagraph();
      queryClient.removeQueries({ queryKey: ['track'] });
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
    await axios.get(`${backend_url}/api/tracks/${trackId}/leave`, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
