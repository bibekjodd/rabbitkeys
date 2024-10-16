'use client';
import { createTrackKey } from '@/mutations/use-create-track';
import { joinTrackKey } from '@/mutations/use-join-track';
import { leaveTrackKey } from '@/mutations/use-leave-track';
import { startRaceKey } from '@/mutations/use-start-race';
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
  const isLeavingTrack = useIsMutating({ mutationKey: leaveTrackKey });
  const isJoiningTrack = useIsMutating({ mutationKey: joinTrackKey });
  const isCreatingTrack = useIsMutating({ mutationKey: createTrackKey });
  const isStartingRace = useIsMutating({ mutationKey: startRaceKey });
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
