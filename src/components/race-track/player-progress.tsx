'use client';
import { useProfile } from '@/queries/useProfile';
import { useTrack } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { useLiveScore } from '@/store/useLiveScore';
import { useReplayStore } from '@/store/useReplayStore';
import { memo } from 'react';
import { roadStripes } from '../utils/stripes';

export default function PlayerProgress() {
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  return (
    <div>
      {!isReplayStarted && <SingleplayerProgress />}
      {!isReplayStarted && isMultiplayer && <MutliplayerProgress />}
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
  };
};
const BasePlayerProgress = memo(function Component({ player }: BasePlayerProgressProps) {
  const isReady = useGameStore((state) => state.isReady);
  const canStart = useGameStore((state) => state.canStart);

  const score = useLiveScore((state) => state.scores.find((score) => score.playerId === player.id));

  let left = score?.progress || 0;
  if (isReady) left = 0;
  if (player.isFinished) left = 100;
  // if (canStart && player.isFinished && isMultiplayer) left = 0;

  return (
    <div className={`relative flex h-16 flex-col justify-between sm:h-20`}>
      {roadStripes}
      <img
        src={player?.carImage || ''}
        alt="player vehicle"
        className={`absolute left-10 top-1/2 z-30 h-16 -translate-y-1/2 transition-all
        ${isReady ? 'duration-0' : 'duration-1000'}
        ${canStart && player.isFinished ? '' : ''}
        `}
        style={{
          left: left + '%'
        }}
      />
    </div>
  );
});

function SingleplayerProgress() {
  const isFinished = useGameStore((state) => state.isFinished);
  const carImage = useGameStore((state) => state.carImage);
  const { data: profile } = useProfile();

  return (
    <BasePlayerProgress
      player={{
        id: '',
        name: profile?.name || '',
        email: profile?.email || '',
        image: profile?.image || '',
        carImage,
        isFinished
      }}
    />
  );
}

function MutliplayerProgress() {
  const { data: track } = useTrack();
  const { data: profile } = useProfile();
  const players = track?.players.filter((player) => player.id !== profile?.id);

  return players?.map((player) => {
    return (
      <BasePlayerProgress
        key={player.id}
        player={{
          ...player,
          isFinished: track?.isFinished || player.isFinished
        }}
      />
    );
  });
}

function ReplayProgress() {
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
        isFinished
      }}
    />
  );
}
