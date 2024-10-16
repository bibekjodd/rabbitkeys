import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { profileKey } from './use-profile';

export const userKey = (userId: string) => ['user', userId];

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: userKey(userId),
    queryFn: ({ signal }) => fetchUser({ userId, signal }),
    initialData() {
      const user = queryClient.getQueryData<User>(profileKey);
      if (user?.id === userId) return user;
      return undefined;
    }
  });
};

const fetchUser = async ({
  signal,
  userId
}: {
  signal: AbortSignal;
  userId: string;
}): Promise<User> => {
  try {
    const { data } = await axios.get<{ user: User }>(`${backendUrl}/api/users/${userId}`, {
      signal
    });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
