import { useProfile } from '@/queries/useProfile';
import { useTrack } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { BasePlayerProgress } from '.';

export default function MultiplayerProgress() {
  const { data: track } = useTrack();
  const { data: profile } = useProfile();
  const isReady = useGameStore((state) => state.isReady);
  const players = track?.players.filter((player) => player.id !== profile?.id);

  return players?.map((player) => {
    return (
      <BasePlayerProgress
        key={player.id}
        player={{
          ...player,
          isFinished: track?.isFinished || player.isFinished,
          progress: isReady ? 0 : undefined,
          speed: undefined
        }}
      />
    );
  });
}
