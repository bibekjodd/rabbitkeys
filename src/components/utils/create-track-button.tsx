'use client';
import { useCreateTrack } from '@/mutations/useCreateTrack';
import { useProfile } from '@/queries/useProfile';
import { useTrack } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';
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
  const isJoiningTrack = useIsMutating({ mutationKey: ['join-track'] });
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  const createTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
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
