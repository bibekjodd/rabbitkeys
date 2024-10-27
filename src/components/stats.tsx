'use client';
import { robotoMono } from '@/lib/fonts';
import { cn, formatDuration } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useTypingStore } from '@/store/use-typing-store';
import TimelineChart from './timeline-chart';

export default function Stats() {
  const isFinished = useGameStore((state) => state.isFinished);
  if (!isFinished) return null;

  return (
    <div className="w-full" id="typing-stats">
      <TimelineChart />
      <Main />
    </div>
  );
}

function Main() {
  const speed = useTypingStore((state) => state.speed);
  const accuracy = useTypingStore((state) => state.accuracy);
  const duration = useTypingStore((state) => state.duration);
  const topSpeed = useTypingStore((state) => state.topSpeed);
  const totalErrorsCount = useTypingStore((state) => state.totalErrorsCount);
  const previousParagraph = useTypingStore((state) => state.previousParagraph);
  return (
    <section
      className={cn(
        robotoMono.className,
        'mx-auto flex flex-wrap justify-between pt-20 text-gray-400'
      )}
      id="stats"
    >
      <div className="flex flex-col p-3 lg:p-4">
        <span>Accuracy</span>
        <span className="text-3xl font-semibold text-green-500 lg:text-4xl">{accuracy}%</span>
      </div>

      <div className="flex flex-col p-3 lg:p-4">
        <span>
          Characters{' '}
          <span className="text-xs italic">
            <span className="text-gray-400">total</span> {' / '}
            <span className="text-teal-500">correct</span> {' / '}
            <span className="text-rose-500">incorrect</span>
          </span>
        </span>
        <span className="text-3xl font-semibold lg:text-4xl">
          <span className="text-gray-400">
            {previousParagraph?.text.length! + totalErrorsCount}
          </span>
          {' / '}
          <span className="text-teal-500">{previousParagraph?.text.length}</span>
          {' / '}
          <span className="text-rose-500">{totalErrorsCount}</span>
        </span>
      </div>

      <div className="flex flex-col p-3 lg:p-4">
        <span>Average Speed</span>
        <span className="text-3xl font-semibold text-sky-500 lg:text-4xl">{Math.round(speed)}</span>
      </div>

      <div className="flex flex-col p-3 lg:p-4">
        <span>Top Speed</span>
        <span className="text-3xl font-semibold text-purple-500 lg:text-4xl">
          {Math.round(topSpeed)}
        </span>
      </div>

      <div className="flex flex-col p-3 lg:p-4">
        <span>Total Time</span>
        <span className="text-3xl font-semibold text-yellow-500 lg:text-4xl">
          {formatDuration(duration)}
        </span>
      </div>
    </section>
  );
}
