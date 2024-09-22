import { useNextParagraph } from '@/mutations/use-next-paragraph';
import { useStartRace } from '@/mutations/use-start-race';
import { useParagraph } from '@/queries/use-paragraph';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { ButtonHTMLAttributes, useCallback } from 'react';
import { toast } from 'sonner';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function StartButton({ onClick, children, ...props }: Props) {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const clearGame = useGameStore((state) => state.clearGame);
  const startGame = useGameStore((state) => state.startGame);
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const canStart = useGameStore((state) => state.canStart);
  const { data: track, isLoading: isLoadingTrack } = useTrack();
  const { data: paragraph } = useParagraph(track?.paragraphId);
  const { mutate: startMultiplayer } = useStartRace();
  const { mutate: fetchNextParagraph } = useNextParagraph();
  const { data: profile } = useProfile();
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const isJoiningTrack = useIsMutating({ mutationKey: ['join-track'] });
  const isCreatingTrack = useIsMutating({ mutationKey: ['create-track'] });
  const isStartingRace = useIsMutating({ mutationKey: ['start-race'] });
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  const handleStartButtonClicked = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(e);
      toast.dismiss();
      if (isStarted || isReady) {
        toast.dismiss();
        toast.info('Game has already started');
        return;
      }
      clearGame();

      // startGame single player
      if (!isMultiplayer) {
        await startGame();
        fetchNextParagraph(paragraph?.id || '');
        return;
      }

      // startGame multiplayer
      if (!track?.id) {
        toast.error('Join the track first to start the race');
        return;
      }
      startMultiplayer(track.id);
    },
    [
      clearGame,
      isMultiplayer,
      isReady,
      isStarted,
      onClick,
      paragraph,
      startGame,
      startMultiplayer,
      track,
      fetchNextParagraph
    ]
  );

  if (
    isStarted ||
    isReady ||
    isLoadingTrack ||
    track?.isStarted ||
    isJoiningTrack ||
    isLeavingTrack ||
    isCreatingTrack ||
    isStartingRace ||
    pathname !== '/' ||
    isReplayStarted ||
    !canStart ||
    !paragraph ||
    (track && track.creator !== profile?.id)
  )
    return null;
  return (
    <button {...props} onClick={handleStartButtonClicked}>
      {children}
    </button>
  );
}
