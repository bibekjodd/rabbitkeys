import { useProfile } from '@/queries/use-profile';
import { useGameStore } from '@/store/use-game-store';
import { useTypingStore } from '@/store/use-typing-store';
import { BasePlayerProgress } from '.';

export default function SingleplayerProgress() {
  const isFinished = useGameStore((state) => state.isFinished);
  const carImage = useGameStore((state) => state.carImage);
  const speed = useTypingStore((state) => state.speed);
  const progress = useTypingStore((state) => state.progress);
  const { data: profile } = useProfile();

  return (
    <BasePlayerProgress
      player={{
        id: '',
        name: profile?.name || '',
        email: profile?.email || '',
        image: profile?.image || '',
        carImage,
        isFinished,
        progress: isFinished ? 100 : progress,
        speed
      }}
    />
  );
}
