'use client';
import { selectRandomCarImage } from '@/lib/constants';
import { useProfile } from '@/queries/use-profile';
import { trackKey } from '@/queries/use-track';
import { clearGame, switchMode, updateCarImage, useGameStore } from '@/store/use-game-store';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useSyncGame = () => {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const trackId = useGameStore((state) => state.trackId);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') clearGame();
  }, [pathname]);

  useEffect(() => {
    if (isLoadingProfile) return;
    if (profile?.carImage) {
      updateCarImage(profile.carImage);
      return;
    }
    const carImage = selectRandomCarImage();
    updateCarImage(carImage);
  }, [profile, isLoadingProfile]);

  useEffect(() => {
    const trackId = searchParams.get('track');
    if (trackId) {
      switchMode({ isMultiplayer: true, trackId });
    } else {
      switchMode({ isMultiplayer: false });
    }
  }, [searchParams]);

  useEffect(() => {
    clearGame();
    if (isMultiplayer) {
      router.replace(`/?track=${trackId}`);
    } else {
      queryClient.removeQueries({ queryKey: trackKey });
      if (location.pathname === '/') {
        router.replace('/');
      }
    }
  }, [isMultiplayer, router, trackId, queryClient]);

  useEffect(() => {
    clearGame();
  }, [trackId]);
  return null;
};
