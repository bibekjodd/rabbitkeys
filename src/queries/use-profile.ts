import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const profileKey = ['profile'];

export const useProfile = () => {
  return useQuery({
    queryKey: profileKey,
    queryFn: fetchProfile,
    refetchOnWindowFocus: true
  });
};

export const fetchProfile = async ({ signal }: { signal: AbortSignal }): Promise<User> => {
  try {
    const { data } = await axios.get<{ user: User }>(`${backendUrl}/api/users/profile`, {
      withCredentials: true,
      signal
    });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
