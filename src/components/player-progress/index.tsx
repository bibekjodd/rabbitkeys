'use client';
import { roadStripes } from '@/components/utils/stripes';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';
import { useLiveScore } from '@/store/use-live-score';
import { useReplayStore } from '@/store/use-replay-store';
import { useEffect, useState } from 'react';
import MultiplayerProgress from './multiplayer-progress';
import ReplayProgress from './replay-progress';
import SingleplayerProgress from './singleplayer-progress';

export default function PlayerProgress() {
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  return (
    <div>
      {!isReplayStarted && <SingleplayerProgress />}
      {!isReplayStarted && isMultiplayer && <MultiplayerProgress />}
      {isReplayStarted && <ReplayProgress />}
      {roadStripes}
    </div>
  );
}

type BasePlayerProgressProps = {
  player: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    carImage: string | null;
    isFinished: boolean;
    speed?: number;
    progress?: number;
  };
};
export function BasePlayerProgress({ player }: BasePlayerProgressProps) {
  const isReady = useGameStore((state) => state.isReady);
  const isMultiplayerFinished = useGameStore((state) => state.isMultiplayerFinished);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const canStart = useGameStore((state) => state.canStart);
  const score = useLiveScore((state) => state.scores.find((score) => score.playerId === player.id));
  const [shouldStayAtStart, setShouldStayAtStart] = useState(false);

  let left = player.progress || 0;
  if (typeof player.progress === 'undefined') {
    left = score?.progress || 0;
  }
  if (player.isFinished) left = 100;
  if (isReady) left = 0;
  if (shouldStayAtStart) left = 0;
  if (canStart && player.isFinished && !isMultiplayer) left = 0;

  useEffect(() => {
    if (isMultiplayer && !isMultiplayerFinished) {
      setShouldStayAtStart(false);
      return;
    }
    if (!isMultiplayer && !player.isFinished) {
      setShouldStayAtStart(false);
      return;
    }
    const timeout = setTimeout(() => {
      setShouldStayAtStart(true);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isMultiplayerFinished, isMultiplayer, player.isFinished]);

  return (
    <div className={`relative flex h-16 flex-col justify-between sm:h-20`}>
      {roadStripes}
      <img
        src={player?.carImage || undefined}
        alt="player vehicle"
        className={cn('absolute left-10 top-1/2 z-30 h-16 -translate-y-1/2 transition-all', {
          'duration-0': isReady,
          'duration-1000': !isReady
        })}
        style={{
          left: left + '%'
        }}
      />
    </div>
  );
}
