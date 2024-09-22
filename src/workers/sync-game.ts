'use client';
import { selectRandomCarImage } from '@/lib/constants';
import { useProfile } from '@/queries/use-profile';
import { useGameStore } from '@/store/use-game-store';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useSyncGame = () => {
  const switchMode = useGameStore((state) => state.switchMode);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const trackId = useGameStore((state) => state.trackId);
  const clearGame = useGameStore((state) => state.clearGame);
  const updateCarImage = useGameStore((state) => state.updateCarImage);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') clearGame();
  }, [pathname, clearGame]);

  useEffect(() => {
    if (isLoadingProfile) return;
    if (profile?.carImage) {
      updateCarImage(profile.carImage);
      return;
    }
    const carImage = selectRandomCarImage();
    updateCarImage(carImage);
  }, [profile, isLoadingProfile, updateCarImage]);

  useEffect(() => {
    const trackId = searchParams.get('track');
    if (trackId) {
      switchMode({ isMultiplayer: true, trackId });
    } else {
      switchMode({ isMultiplayer: false });
    }
  }, [searchParams, switchMode]);

  useEffect(() => {
    clearGame();
    if (isMultiplayer) {
      router.replace(`/?track=${trackId}`);
    } else {
      queryClient.removeQueries({ queryKey: ['track'] });
      if (location.pathname === '/') {
        router.replace('/');
      }
    }
  }, [isMultiplayer, clearGame, router, trackId, queryClient]);

  useEffect(() => {
    clearGame();
  }, [trackId, clearGame]);
  return null;
};
