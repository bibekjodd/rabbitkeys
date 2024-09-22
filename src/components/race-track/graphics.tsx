import { flagImage } from '@/lib/constants';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';

export default function Graphics() {
  return (
    <>
      {/* dark shadow on each end of track*/}
      <div className="absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-neutral-900" />
      <div className="absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-neutral-900" />

      {/* blur track lines at each end of track*/}
      <div className="absolute left-0 top-0 z-20 h-full w-7 filter backdrop-blur-[1px] sm:w-16" />
      <div className="absolute right-0 top-0 z-20 h-full w-7 filter backdrop-blur-[1px] sm:w-16" />

      {/* dark shadow on each side of track */}
      <div className="absolute left-0 top-2 z-20 h-10 w-full bg-gradient-to-b from-neutral-900/60" />
      <div className="absolute bottom-2 left-0 z-20 h-10 w-full bg-gradient-to-t from-neutral-900/60" />
      <Flags />
    </>
  );
}

function Flags() {
  return (
    <>
      <GameFlag />
      <ReplayFlag />
    </>
  );
}

function GameFlag() {
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const countdown = useGameStore((state) => state.countdown);
  return <BaseFlag countdown={countdown} isReady={isReady} isStarted={isStarted} />;
}
function ReplayFlag() {
  const isReady = useReplayStore((state) => state.isReady);
  const isStarted = useReplayStore((state) => state.isStarted);
  const countdown = useReplayStore((state) => state.countdown);
  return <BaseFlag countdown={countdown} isReady={isReady} isStarted={isStarted} />;
}

function BaseFlag({
  isReady,
  isStarted,
  countdown
}: {
  isReady: boolean;
  isStarted: boolean;
  countdown: number;
}) {
  if (!isReady && !isStarted) return null;
  return (
    <>
      <img
        src={flagImage}
        alt="flag"
        className={`absolute top-0 z-20 -translate-y-16 transition-all duration-1000 ${
          countdown <= 0 || isStarted
            ? 'left-full top-5 h-24 w-24 -translate-x-40 rotate-[20deg] -scale-x-100'
            : 'left-1/2 h-64 w-64 -translate-x-[calc(50%-64px)]'
        } `}
      />

      <img
        src={flagImage}
        alt="flag"
        className={`absolute top-0 z-20 transition-all duration-1000 ${
          countdown <= 0 || isStarted
            ? 'left-full top-1/2 h-24 w-24 -translate-x-40 translate-y-2 rotate-[20deg] -scale-x-100'
            : 'left-1/2 h-64 w-64 -translate-x-[calc(50%+64px)] -translate-y-16 -scale-x-100'
        } `}
      />
    </>
  );
}
