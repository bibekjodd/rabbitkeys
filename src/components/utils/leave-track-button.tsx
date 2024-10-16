'use client';
import { createTrackKey } from '@/mutations/use-create-track';
import { joinTrackKey } from '@/mutations/use-join-track';
import { leaveTrackKey, useLeaveTrack } from '@/mutations/use-leave-track';
import { startRaceKey } from '@/mutations/use-start-race';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export default function LeaveTrackButton({ onClick, children, ...props }: ButtonProps) {
  const trackId = useGameStore((state) => state.trackId);
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const isCreatingTrack = useIsMutating({ mutationKey: createTrackKey });
  const isLeavingTrack = useIsMutating({ mutationKey: leaveTrackKey });
  const isJoiningTrack = useIsMutating({ mutationKey: joinTrackKey });
  const isStartingRace = useIsMutating({ mutationKey: startRaceKey });
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const { mutate } = useLeaveTrack();
  const pathname = usePathname();

  const leaveTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (trackId) mutate(trackId);
  };

  if (
    isReady ||
    isStarted ||
    !trackId ||
    isCreatingTrack ||
    isLeavingTrack ||
    isJoiningTrack ||
    isStartingRace ||
    isReplayStarted ||
    pathname !== '/'
  )
    return null;

  return (
    <button {...props} onClick={leaveTrack}>
      {children}
    </button>
  );
}
