import { robotoMono } from '@/lib/fonts';
import { cn, formatDuration } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useTypingStore } from '@/store/use-typing-store';
import { TimerIcon } from 'lucide-react';

export default function Timer() {
  const isStarted = useGameStore((state) => state.isStarted);
  const isReady = useGameStore((state) => state.isReady);

  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const isReplayReady = useReplayStore((state) => state.isReady);

  return (
    <div
      className={cn(
        robotoMono.className,
        'flex h-12 items-center space-x-2.5 pl-3.5 text-gray-200'
      )}
    >
      {!isReady && isStarted && (
        <>
          <TimerIcon className="h-4 w-4" />
          <span>
            <GameTimer />
          </span>
        </>
      )}
      {isReplayStarted && !isReplayReady && (
        <>
          <TimerIcon className="h-4 w-4" />
          <span>
            <ReplayTimer />
          </span>
        </>
      )}
    </div>
  );
}

function GameTimer() {
  const duration = useTypingStore((state) => state.duration);
  return formatDuration(duration);
}

function ReplayTimer() {
  const currentIndex = useReplayStore((state) => state.currentIndex);
  const replayData = useReplayStore((state) => state.data);
  const duration = replayData[currentIndex]?.duration || 0;
  return formatDuration(duration);
}
