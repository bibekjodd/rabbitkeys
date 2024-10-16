import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const activePlayersKey = (search: string) => ['active-player', search];

export const useActivePlayers = (search: string, enabled: boolean) => {
  return useQuery({
    queryKey: activePlayersKey(search),
    queryFn: ({ signal }) => fetchActivePlayers({ signal, search }),
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    gcTime: 30_000
  });
};

export const fetchActivePlayers = async ({
  search,
  signal
}: {
  signal: AbortSignal;
  search: string;
}): Promise<User[]> => {
  try {
    const { data } = await axios.get<{ users: User[] }>(
      `${backendUrl}/api/users?q=${search}&active=true`,
      { signal }
    );
    return data.users;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
