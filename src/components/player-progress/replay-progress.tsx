import { useProfile } from '@/queries/use-profile';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { BasePlayerProgress } from '.';

export default function ReplayProgress() {
  const carImage = useGameStore((state) => state.carImage);
  const paragraph = useReplayStore((state) => state.paragraph);
  const isStarted = useReplayStore((state) => state.isStarted);
  const currentIndex = useReplayStore((state) => state.currentIndex);
  const replayData = useReplayStore((state) => state.data);
  const { data: profile } = useProfile();
  const currentSnapshot = replayData[currentIndex];
  const speed = currentSnapshot.speed;
  const progress = (currentSnapshot.index / (paragraph?.text.length || 1)) * 100;
  const isFinished = !isStarted;

  return (
    <BasePlayerProgress
      player={{
        id: profile?.id || '',
        name: profile?.name || '',
        email: profile?.email || '',
        image: profile?.image || '',
        carImage,
        isFinished,
        progress,
        speed
      }}
    />
  );
}
