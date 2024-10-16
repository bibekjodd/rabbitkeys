import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const trackKey = ['track'];

export const useTrack = () => {
  const isStarted = useGameStore((state) => state.isStarted);
  const trackId = useGameStore((state) => state.trackId);
  let refetchInterval: number | false = 60_000;
  if (isStarted) refetchInterval = false;

  return useQuery({
    queryKey: trackKey,
    queryFn: ({ signal }) => fetchTrackData({ signal, trackId }),
    enabled: !!trackId,
    refetchInterval,
    refetchIntervalInBackground: true,
    retry: 1,
    refetchOnWindowFocus: true
  });
};

export const fetchTrackData = async ({
  signal,
  trackId
}: {
  trackId: string | null | undefined;
  signal: AbortSignal | undefined;
}): Promise<Track> => {
  if (!trackId) {
    throw new Error('Could not join track with invalid id');
  }
  try {
    const { data } = await axios.get<{ track: Track }>(`${backendUrl}/api/tracks/${trackId}`, {
      withCredentials: true,
      signal
    });
    return data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
