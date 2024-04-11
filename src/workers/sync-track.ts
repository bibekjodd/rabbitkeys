import { useInterval } from '@/hooks/useInterval';
import { usePrevious } from '@/hooks/usePrevious';
import { useTimeout } from '@/hooks/useTimeout';
import { useUpdateScore } from '@/mutations/useUpdateScore';
import { useParagraph } from '@/queries/useParagraph';
import { useProfile } from '@/queries/useProfile';
import { useTrack } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

export const useSyncTrack = () => {
  const isFinished = useGameStore((state) => state.isFinished);
  const isStarted = useGameStore((state) => state.isStarted);
  const startGame = useGameStore((state) => state.startGame);
  const isFinishedPrevious = usePrevious(isFinished);
  const queryClient = useQueryClient();
  const { data: track } = useTrack();
  const { data: profile } = useProfile();
  const { data: paragraph } = useParagraph(track?.paragraphId);

  const myTrackData = track?.players.find((player) => player.id === profile?.id);
  const { mutate: updateScoreOnline } = useUpdateScore();
  useInterval(updateScoreOnline, 1000, !!(track?.isStarted && !isFinished && isStarted));
  useEffect(() => {
    if (!isFinishedPrevious && isFinished) {
      updateScoreOnline();
    }
  }, [isFinished, isFinishedPrevious, updateScoreOnline]);

  const refetchTrack = useCallback(() => {
    if (queryClient.isFetching({ queryKey: ['track'] }) || !track?.id) return;
    queryClient.invalidateQueries({
      queryKey: ['track']
    });
  }, [track?.id, queryClient]);

  useTimeout(refetchTrack, 1000, isStarted || isFinished || track?.isStarted || track?.isFinished);

  // sync to local
  useEffect(() => {
    if (!track) return;
    if (track.paragraphId !== paragraph?.id) return;
    if (track.isStarted && !myTrackData?.isFinished) {
      if (!isFinished) startGame();
    }
  }, [track, isFinished, startGame, myTrackData?.isFinished, paragraph?.id]);

  useEffect(() => {
    const { isMultiplayerFinished } = useGameStore.getState();
    if (track?.isFinished && !isMultiplayerFinished) {
      useGameStore.setState({ isMultiplayerFinished: true });
    }
  }, [track?.isFinished]);
  return null;
};
