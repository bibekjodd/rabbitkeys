import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchOnMount: true
  });
};

const fetchLeaderboard = async (): Promise<Leaderboard> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/leaderboard`, { withCredentials: true });
    return data.leaderboard;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
