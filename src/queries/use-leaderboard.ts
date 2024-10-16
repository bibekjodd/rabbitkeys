import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const leaderboardKey = ['leaderboard'];

export const useLeaderboard = () => {
  return useQuery({
    queryKey: leaderboardKey,
    queryFn: fetchLeaderboard,
    staleTime: 60_000,
    refetchOnMount: true
  });
};

const fetchLeaderboard = async ({ signal }: { signal: AbortSignal }): Promise<Leaderboard> => {
  try {
    const { data } = await axios.get<{ leaderboard: Leaderboard }>(
      `${backendUrl}/api/stats/leaderboard`,
      { signal }
    );
    return data.leaderboard;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
