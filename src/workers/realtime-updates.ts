import {
  JoinedTrackResponse,
  LeftTrackResponse,
  RaceFinishedResponse,
  RaceStartedResponse,
  RemovedFromTrackResponse,
  UpdateScoreResponse,
  events
} from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  onJoinedTrack,
  onLeftTrack,
  onRaceFinished,
  onRaceStarted,
  onRemovedFromTrack,
  onTrackDeleted,
  onUpdateScore
} from './events-actions';

export const useRealtimeUpdates = () => {
  const { data: track } = useTrack();
  const trackId = track?.id;
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [channel, setChannel] = useState(trackId ? pusher.subscribe(trackId) : null);

  useEffect(() => {
    if (!trackId) return;
    setChannel(pusher.subscribe(trackId));
    return () => {
      pusher.unsubscribe(trackId);
      setChannel(null);
    };
  }, [trackId]);

  useEffect(() => {
    if (!channel || !trackId || !profile?.id) return;

    channel.bind(events.joinedTrack, (data: JoinedTrackResponse) => {
      onJoinedTrack({ queryClient, data });
    });

    channel.bind(events.leftTrack, (data: LeftTrackResponse) => {
      onLeftTrack({ queryClient, router, data });
    });

    channel.bind(events.removedFromTrack, (data: RemovedFromTrackResponse) => {
      onRemovedFromTrack({ queryClient, router, data });
    });

    channel.bind(events.trackDeleted, () => {
      onTrackDeleted({ router, queryClient });
    });

    channel.bind(events.raceStarted, (data: RaceStartedResponse) => {
      onRaceStarted({ queryClient, data });
    });

    channel.bind(events.updateScore, (data: UpdateScoreResponse) => {
      onUpdateScore(data);
    });

    channel.bind(events.raceFinished, (data: RaceFinishedResponse) => {
      onRaceFinished({ queryClient, data });
    });

    return () => {
      channel.unbind_all();
    };
  }, [queryClient, router, trackId, channel, profile?.id]);

  return null;
};
