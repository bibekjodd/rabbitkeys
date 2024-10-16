import { events, InvitePlayerResponse } from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { useProfile } from '@/queries/use-profile';
import { useEffect, useState } from 'react';
import { onInvitePlayer } from './events-actions';

export const usePersonalUpdates = () => {
  const { data: profile } = useProfile();
  const [channel, setChannel] = useState(profile?.id ? pusher.subscribe(profile.id) : null);

  useEffect(() => {
    if (!profile?.id) return;

    setChannel(pusher.subscribe(profile.id));
    return () => {
      pusher.unsubscribe(profile.id);
      setChannel(null);
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!channel) return;

    channel.bind(events.invitePlayer, (data: InvitePlayerResponse) => {
      onInvitePlayer(data);
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel]);

  return null;
};
