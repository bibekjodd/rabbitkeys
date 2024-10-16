'use client';
import { useCreateTrack } from '@/mutations/use-create-track';
import { joinTrackKey } from '@/mutations/use-join-track';
import { leaveTrackKey } from '@/mutations/use-leave-track';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';
import { toast } from 'sonner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export default function CreateTrackButton({ onClick, children, ...props }: ButtonProps) {
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const { mutate, isPending } = useCreateTrack();
  const { data: track, isLoading: isLoadingTrack, isFetching: isFetchingTrack } = useTrack();
  const { data: profile, isError: isProfileError } = useProfile();
  const isJoiningTrack = useIsMutating({ mutationKey: joinTrackKey });
  const isLeavingTrack = useIsMutating({ mutationKey: leaveTrackKey });
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  const createTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (isReady || isStarted) {
      toast.error('Exit from the current race first');
      return;
    }
    mutate();
  };
  if (
    isReady ||
    isStarted ||
    !profile ||
    isProfileError ||
    isLoadingTrack ||
    isFetchingTrack ||
    track ||
    isPending ||
    isJoiningTrack ||
    isLeavingTrack ||
    isReplayStarted ||
    pathname !== '/'
  ) {
    return null;
  }
  return (
    <button {...props} onClick={createTrack}>
      {children}
    </button>
  );
}
