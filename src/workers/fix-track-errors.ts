import { useGameStore } from '@/store/use-game-store';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTrack } from '../queries/use-track';

export const useFixTrackErrors = () => {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const switchMode = useGameStore((state) => state.switchMode);
  const trackId = useGameStore((state) => state.trackId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const trackQuery = useTrack();

  useEffect(() => {
    if (!trackId) {
      queryClient.removeQueries({ queryKey: ['track'] });
      switchMode({ isMultiplayer: false });
    }
  }, [trackId, queryClient, switchMode]);

  useEffect(() => {
    if (!isMultiplayer) {
      queryClient.removeQueries({ queryKey: ['track'] });
    }
  }, [isMultiplayer, queryClient]);

  useEffect(() => {
    if (trackQuery.isError) {
      queryClient.removeQueries({ queryKey: ['track'] });
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
  }, [trackId, trackQuery, isMultiplayer, router, switchMode, queryClient]);

  return null;
};
