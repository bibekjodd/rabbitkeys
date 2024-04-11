import { robotoMono } from '@/lib/fonts';
import { formatDuration } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';
import { useTypingStore } from '@/store/useTypingStore';
import { TimerIcon } from 'lucide-react';

export default function Timer() {
  const isStarted = useGameStore((state) => state.isStarted);
  const isReady = useGameStore((state) => state.isReady);

  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const isReplayReady = useReplayStore((state) => state.isReady);

  return (
    <div
      className={`flex h-12 items-center space-x-3 pl-4 text-lg text-gray-200 ${robotoMono.className}`}
    >
      {isStarted && !isReady && (
        <>
          <TimerIcon className="h-5 w-5" />
          <span>
            <GameTimer />
          </span>
        </>
      )}
      {isReplayStarted && !isReplayReady && (
        <>
          <TimerIcon className="h-5 w-5" />
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
