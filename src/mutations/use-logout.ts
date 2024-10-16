import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { clearGame, switchMode } from '@/store/use-game-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onMutate() {
      queryClient.setQueryData(profileKey, null);
      clearGame();
      switchMode({ isMultiplayer: false });
      queryClient.setQueryData(profileKey, null);
      if (location.search) router.replace('/');
    }
  });
};

const logout = async () => {
  try {
    return await axios.post(`${backendUrl}/api/auth/logout`, undefined, { withCredentials: true });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
