'use client';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = { children: React.ReactNode };
export default function LeaderboardButton({ children }: Props) {
  const isStarted = useGameStore((state) => state.isStarted);
  const isReady = useGameStore((state) => state.isReady);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const isJoiningTrack = useIsMutating({ mutationKey: ['join-track'] });
  const isCreatingTrack = useIsMutating({ mutationKey: ['create-track'] });
  const isStartingRace = useIsMutating({ mutationKey: ['start-race'] });
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  if (
    isReady ||
    isStarted ||
    isMultiplayer ||
    isLeavingTrack ||
    isJoiningTrack ||
    isCreatingTrack ||
    isStartingRace ||
    isReplayStarted ||
    pathname === '/leaderboard'
  ) {
    return null;
  }

  return children;
}
