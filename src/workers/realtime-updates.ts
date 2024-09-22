import {
  InvitePlayerResponse,
  LeftTrackResponse,
  RaceFinishedResponse,
  RemovedFromTrackResponse,
  UpdateScoreResponse,
  events
} from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { canStartAfterDelay, scrollIntoView, wait } from '@/lib/utils';
import { fetchParagraph } from '@/queries/use-paragraph';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useLiveScore } from '@/store/use-live-score';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useRealtimeUpdates = () => {
  const { data: track } = useTrack();
  const trackId = track?.id;
  const switchMode = useGameStore((state) => state.switchMode);
  const clearGame = useGameStore((state) => state.clearGame);
  const endGame = useGameStore((state) => state.endGame);
  const startGame = useGameStore((state) => state.startGame);
  const updateInvitation = useGameStore((state) => state.updateInvitation);
  const { data: profile } = useProfile();
  const myEmail = profile?.email;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [channel, setChannel] = useState(trackId ? pusher.subscribe(trackId) : null);
  const [personalChannel, setPersonalChannel] = useState(
    trackId ? pusher.subscribe(trackId) : null
  );

  /* subscribe to track channel */
  useEffect(() => {
    if (trackId) {
      const newChannel = pusher.subscribe(trackId);
      setChannel(newChannel);
    }
    return () => {
      trackId && pusher.unsubscribe(trackId);
      setChannel(null);
    };
  }, [trackId]);

  /* subscribe to personal channel */
  useEffect(() => {
    if (profile?.id) {
      const channel = pusher.subscribe(profile.id);
      setPersonalChannel(channel);
    }

    return () => {
      profile?.id && pusher.unsubscribe(profile.id);
      setPersonalChannel(null);
    };
  }, [profile?.id]);

  /* bind event listeners on personal channel */
  useEffect(() => {
    if (!personalChannel) return;
    personalChannel.bind(events.invitePlayer, (data: InvitePlayerResponse) => {
      updateInvitation(data);
    });
  }, [personalChannel, updateInvitation]);

  // bind event listeners on track channel
  useEffect(() => {
    if (!channel || !trackId || !myEmail) return;

    // joined track
    channel.bind(events.joinedTrack, () => {
      queryClient.invalidateQueries({ queryKey: ['track'] });
    });

    // left track
    channel.bind(events.leftTrack, ({ players: exittedPlayers }: LeftTrackResponse) => {
      if (exittedPlayers.includes(myEmail)) {
        clearGame();
        switchMode({ isMultiplayer: false });
        queryClient.removeQueries({ queryKey: ['track'] });
        router.replace('/');
        return;
      }
      queryClient.setQueryData(['track'], (data: Track | null): Track | null => {
        if (!data) return data;
        const players = data.players.filter((player) => !exittedPlayers.includes(player.id));
        return {
          ...data,
          players: players
        };
      });
      queryClient.invalidateQueries({ queryKey: ['track'] });
    });

    // removed from track
    channel.bind(events.removedFromTrack, ({ message, playerId }: RemovedFromTrackResponse) => {
      const profile = queryClient.getQueryData<User>(['profile']);
      if (playerId === profile?.id) {
        toast.error(message);
        clearGame();
        switchMode({ isMultiplayer: false });
        queryClient.removeQueries({ queryKey: ['track'] });
        router.replace('/');
        return;
      }

      const track = queryClient.getQueryData<Track>(['track']);
      if (!track) return;
      const updatedPlayers = track.players.filter((player) => player.id !== playerId);
      const updatedTrack: Track = { ...track, players: updatedPlayers };
      queryClient.setQueryData<Track>(['track'], updatedTrack);
      queryClient.invalidateQueries({ queryKey: ['track'] });
    });

    // track deleted
    channel.bind(events.trackDeleted, () => {
      toast.info('Creator has deleted the current track! Switching to Single player mode.');
      queryClient.removeQueries({ queryKey: ['track'] });
      switchMode({ isMultiplayer: false });
      router.replace('/');
    });

    // race started
    channel.bind(events.raceStarted, () => {
      queryClient.invalidateQueries({ queryKey: ['track'] });
      const track = queryClient.getQueryData<Track>(['track']);
      if (!track) return;

      const playersStats = track.players.map((player) => ({
        ...player,
        isFinished: false
      }));
      queryClient.setQueryData<Track>(['track'], {
        ...track,
        players: playersStats
      });
      useLiveScore.getState().clear();
      startGame();
      queryClient.prefetchQuery({
        queryKey: ['paragraph', track.nextParagraphId],
        queryFn: () => fetchParagraph(track.nextParagraphId)
      });
    });

    // players score update
    channel.bind(events.updateScore, ({ playerId, progress, speed }: UpdateScoreResponse) => {
      useLiveScore.getState().updateScore({ playerId, progress, speed });
    });

    // race finished
    channel.bind(events.raceFinished, ({ track }: RaceFinishedResponse) => {
      endGame();
      useLiveScore.getState().clear();
      canStartAfterDelay();
      useGameStore.setState({ isMultiplayerFinished: true });
      queryClient.setQueryData<Track>(['track'], track);
      wait(300).then(() => {
        scrollIntoView('player-ranks');
      });
    });
  }, [clearGame, endGame, myEmail, queryClient, router, startGame, switchMode, trackId, channel]);

  return null;
};
