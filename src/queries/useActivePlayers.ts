import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useActivePlayers = (searchQuery: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['active-players', searchQuery],
    queryFn: () => fetchActivePlayers(searchQuery),
    enabled,
    refetchInterval: 30_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    gcTime: 60_000
  });
};

const fetchActivePlayers = async (searchQuery: string): Promise<User[]> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/active-players?q=${searchQuery}`, {
      withCredentials: true
    });
    return data.players;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
