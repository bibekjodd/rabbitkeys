import { switchMode, useGameStore } from '@/store/use-game-store';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { trackKey, useTrack } from '../queries/use-track';

export const useFixTrackErrors = () => {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const trackId = useGameStore((state) => state.trackId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const trackQuery = useTrack();

  useEffect(() => {
    if (!trackId) {
      queryClient.removeQueries({ queryKey: trackKey });
      switchMode({ isMultiplayer: false });
    }
  }, [trackId, queryClient]);

  useEffect(() => {
    if (!isMultiplayer) {
      queryClient.removeQueries({ queryKey: trackKey });
    }
  }, [isMultiplayer, queryClient]);

  useEffect(() => {
    if (trackQuery.isError) {
      queryClient.removeQueries({ queryKey: trackKey });
      toast.error(trackQuery.error.message);
      switchMode({ isMultiplayer: false });
      router.replace('/');
      return;
    }
    if (!trackId || trackQuery.isLoading || trackQuery.isFetching || trackQuery.isRefetching) {
      return;
    }
    if (trackQuery.isFetched && trackQuery.data?.id !== trackId) {
      trackQuery.refetch();
    }
  }, [trackId, trackQuery, isMultiplayer, router, queryClient]);

  return null;
};
