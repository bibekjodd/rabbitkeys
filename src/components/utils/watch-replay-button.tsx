import { useGameStore } from '@/store/use-game-store';
import { startReplay, useReplayStore } from '@/store/use-replay-store';
import { usePathname } from 'next/navigation';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;
export default function WatchReplayButton({ onClick, children, ...props }: Props) {
  const isReplayAvailable = useReplayStore((state) => state.isReplayAvailable);
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const pathname = usePathname();

  const isGameReady = useGameStore((state) => state.isReady);
  const isFinished = useGameStore((state) => state.isFinished);
  const paragraph = useReplayStore((state) => state.paragraph);
  const isGameStarted = useGameStore((state) => state.isStarted);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);

  const watchReplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    startReplay();
  };

  if (
    isGameReady ||
    isGameStarted ||
    !isFinished ||
    !isReplayAvailable ||
    isReplayStarted ||
    isMultiplayer ||
    !paragraph ||
    pathname !== '/'
  )
    return null;

  return (
    <button {...props} onClick={watchReplay}>
      {children}
    </button>
  );
}
