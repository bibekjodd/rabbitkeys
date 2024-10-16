import {
  InvitePlayerResponse,
  JoinedTrackResponse,
  LeftTrackResponse,
  RaceFinishedResponse,
  RaceStartedResponse,
  RemovedFromTrackResponse,
  UpdateScoreResponse
} from '@/lib/events';
import { canStartAfterDelay, scrollIntoView, wait } from '@/lib/utils';
import { fetchParagraph, paragraphKey } from '@/queries/use-paragraph';
import { profileKey } from '@/queries/use-profile';
import { trackKey } from '@/queries/use-track';
import {
  clearGame,
  endGame,
  startGame,
  switchMode,
  updateInvitation,
  useGameStore
} from '@/store/use-game-store';
import { useLiveScore } from '@/store/use-live-score';
import { QueryClient } from '@tanstack/react-query';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';

export const onInvitePlayer = (data: InvitePlayerResponse) => {
  updateInvitation(data);
};

export const onJoinedTrack = ({
  queryClient,
  data
}: {
  queryClient: QueryClient;
  data: JoinedTrackResponse;
}) => {
  const track = queryClient.getQueryData<Track>(trackKey);
  if (!track) return;
  const updatedTrack = {
    ...track,
    players: track.players.filter((player) => player.id !== data.player.id)
  };
  updatedTrack.players.push(data.player);
  queryClient.setQueryData<Track>(trackKey, updatedTrack);
  queryClient.invalidateQueries({ queryKey: trackKey });
};

export const onLeftTrack = ({
  queryClient,
  data,
  router
}: {
  queryClient: QueryClient;
  data: LeftTrackResponse;
  router: AppRouterInstance;
}) => {
  const profile = queryClient.getQueryData<User>(profileKey);
  const exittedPlayers = data.players;
  if (exittedPlayers.includes(profile?.id!)) {
    clearGame();
    switchMode({ isMultiplayer: false });
    queryClient.removeQueries({ queryKey: trackKey });
    router.replace('/');
    return;
  }
  queryClient.setQueryData(trackKey, (data: Track | null): Track | null => {
    if (!data) return data;
    const players = data.players.filter((player) => !exittedPlayers.includes(player.id));
    return {
      ...data,
      players: players
    };
  });
  queryClient.invalidateQueries({ queryKey: trackKey });
};

export const onRemovedFromTrack = ({
  queryClient,
  data,
  router
}: {
  queryClient: QueryClient;
  data: RemovedFromTrackResponse;
  router: AppRouterInstance;
}) => {
  const { playerId, message } = data;
  const profile = queryClient.getQueryData<User>(profileKey);
  if (playerId === profile?.id) {
    toast.error(message);
    clearGame();
    switchMode({ isMultiplayer: false });
    queryClient.removeQueries({ queryKey: trackKey });
    router.replace('/');
    return;
  }

  const track = queryClient.getQueryData<Track>(trackKey);
  if (!track) return;
  const updatedPlayers = track.players.filter((player) => player.id !== playerId);
  const updatedTrack: Track = { ...track, players: updatedPlayers };
  queryClient.setQueryData<Track>(trackKey, updatedTrack);
  queryClient.invalidateQueries({ queryKey: trackKey });
};

export const onTrackDeleted = ({
  queryClient,
  router
}: {
  queryClient: QueryClient;
  router: AppRouterInstance;
}) => {
  toast.info('Creator has deleted the current track! Switching to Single player mode.');
  queryClient.removeQueries({ queryKey: trackKey });
  switchMode({ isMultiplayer: false });
  router.replace('/');
};

export const onRaceStarted = ({
  queryClient
}: {
  queryClient: QueryClient;
  data: RaceStartedResponse;
}) => {
  queryClient.invalidateQueries({ queryKey: trackKey });
  const track = queryClient.getQueryData<Track>(trackKey);
  if (!track) return;

  const playersStats = track.players.map((player) => ({
    ...player,
    isFinished: false
  }));
  queryClient.setQueryData<Track>(trackKey, {
    ...track,
    players: playersStats
  });
  useLiveScore.getState().clear();
  startGame();
  queryClient.prefetchQuery({
    queryKey: paragraphKey(track.nextParagraphId),
    queryFn: ({ signal }) => fetchParagraph({ paragraphId: track.nextParagraphId, signal }),
    staleTime: 5 * 60 * 1000
  });
};

export const onUpdateScore = (data: UpdateScoreResponse) => {
  useLiveScore
    .getState()
    .updateScore({ playerId: data.playerId, progress: data.progress, speed: data.speed });
};

export const onRaceFinished = ({
  queryClient,
  data
}: {
  queryClient: QueryClient;
  data: RaceFinishedResponse;
}) => {
  const { track } = data;
  endGame();
  useLiveScore.getState().clear();
  canStartAfterDelay();
  useGameStore.setState({ isMultiplayerFinished: true });
  queryClient.setQueryData<Track>(trackKey, track);
  wait(300).then(() => {
    scrollIntoView('player-ranks');
  });
};
