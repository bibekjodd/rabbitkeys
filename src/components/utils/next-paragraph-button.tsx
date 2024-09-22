'use client';
import { useNextParagraph } from '@/mutations/use-next-paragraph';
import { useParagraph } from '@/queries/use-paragraph';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes, useCallback } from 'react';

type NextParagraphButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export default function NextParagraphButton({
  children,
  onClick,
  ...props
}: NextParagraphButtonProps) {
  const queryClient = useQueryClient();
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const isModeDetermined = useGameStore((state) => state.isModeDetermined);
  const isStarted = useGameStore((state) => state.isStarted);
  const isReady = useGameStore((state) => state.isReady);
  const { mutate: fetchNextParagraph } = useNextParagraph();
  const { isLoading: isLoadingParagraph } = useParagraph(null);
  const isCreatingTrack = useIsMutating({ mutationKey: ['create-track'] });
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const isJoiningTrack = useIsMutating({ mutationKey: ['join-track'] });
  const isStartingRace = useIsMutating({ mutationKey: ['start-race'] });
  const pathname = usePathname();
  const isReplayReady = useReplayStore((state) => state.isReady);
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  const handleButtonClicked = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(e);
      if (isMultiplayer || isStarted) return;
      const nextParagraph = queryClient.getQueryData(['paragraph', 'next']);
      if (nextParagraph) queryClient.setQueryData(['paragraph', null], nextParagraph);
      else {
        await queryClient.invalidateQueries({ queryKey: ['paragraph', null] });
      }
      const currentParagraph = queryClient.getQueryData<Paragraph>(['paragraph', null]);
      fetchNextParagraph(currentParagraph?.id || '');
    },
    [queryClient, onClick, isMultiplayer, isStarted, fetchNextParagraph]
  );

  if (
    isReady ||
    isStarted ||
    isMultiplayer ||
    !isModeDetermined ||
    isLoadingParagraph ||
    isReplayReady ||
    isReplayStarted ||
    isCreatingTrack ||
    isJoiningTrack ||
    isLeavingTrack ||
    isStartingRace ||
    pathname !== '/'
  )
    return null;
  return (
    <button {...props} onClick={handleButtonClicked}>
      {children}
    </button>
  );
}
