import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTrack = () => {
  const isStarted = useGameStore((state) => state.isStarted);
  const trackId = useGameStore((state) => state.trackId);
  let refetchInterval: number | false = 60_000;
  if (isStarted) refetchInterval = false;

  return useQuery({
    queryKey: ['track'],
    queryFn: () => fetchTrackData(trackId),
    enabled: !!trackId,
    refetchInterval,
    refetchIntervalInBackground: true,
    retry: 1,
    refetchOnWindowFocus: true
  });
};

export const fetchTrackData = async (trackId: string | null | undefined): Promise<Track> => {
  if (!trackId) {
    throw new Error('Could not join track with invalid id');
  }
  try {
    const { data } = await axios.get(`${backend_url}/api/tracks/${trackId}`, {
      withCredentials: true
    });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
