import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
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
