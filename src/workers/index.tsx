'use client';
import { useFixTrackErrors } from './fix-track-errors';
import { useRealtimeUpdates } from './realtime-updates';
import { useSyncGame } from './sync-game';
import { useSyncTrack } from './sync-track';

export default function Workers() {
  useFixTrackErrors();
  useRealtimeUpdates();
  useSyncGame();
  useSyncTrack();

  return null;
}
