'use client';
import { useLeaveTrack } from '@/mutations/useLeaveTrack';
import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export default function LeaveTrackButton({ onClick, children, ...props }: ButtonProps) {
  const trackId = useGameStore((state) => state.trackId);
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const isCreatingTrack = useIsMutating({ mutationKey: ['create-track'] });
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const isJoiningTrack = useIsMutating({ mutationKey: ['join-track'] });
  const isStartingRace = useIsMutating({ mutationKey: ['start-race'] });
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const { mutate } = useLeaveTrack();
  const pathname = usePathname();

  const leaveTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
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
