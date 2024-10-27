'use client';
import { createTrackKey } from '@/mutations/use-create-track';
import { joinTrackKey } from '@/mutations/use-join-track';
import { leaveTrackKey } from '@/mutations/use-leave-track';
import { useNextParagraph } from '@/mutations/use-next-paragraph';
import { startRaceKey } from '@/mutations/use-start-race';
import { paragraphKey, useParagraph } from '@/queries/use-paragraph';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';

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
  const isCreatingTrack = useIsMutating({ mutationKey: createTrackKey });
  const isLeavingTrack = useIsMutating({ mutationKey: leaveTrackKey });
  const isJoiningTrack = useIsMutating({ mutationKey: joinTrackKey });
  const isStartingRace = useIsMutating({ mutationKey: startRaceKey });
  const pathname = usePathname();
  const isReplayReady = useReplayStore((state) => state.isReady);
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  const handleButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (isMultiplayer || isStarted) return;
    const nextParagraph = queryClient.getQueryData(paragraphKey('next'));
    if (nextParagraph) queryClient.setQueryData(paragraphKey(null), nextParagraph);
    else {
      await queryClient.invalidateQueries({ queryKey: paragraphKey(null) });
    }
    const currentParagraph = queryClient.getQueryData<Paragraph>(paragraphKey(null));
    fetchNextParagraph(currentParagraph?.id || '');
  };

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
