import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';

export default function Countdown() {
  return (
    <>
      <GameCountdown />
      <ReplayCountdown />
    </>
  );
}

function GameCountdown() {
  const isReady = useGameStore((state) => state.isReady);
  const countdown = useGameStore((state) => state.countdown);
  if (!isReady) return null;
  return <BaseCountdown countdown={countdown} />;
}
function ReplayCountdown() {
  const isReady = useReplayStore((state) => state.isReady);
  const countdown = useReplayStore((state) => state.countdown);
  if (!isReady) return null;
  return <BaseCountdown countdown={countdown} />;
}

function BaseCountdown({ countdown }: { countdown: number }) {
  return (
    <div className="absolute inset-0 z-20">
      <div className="relative grid h-full w-full place-items-center">
        <div className="absolute inset-0 z-10 grid place-items-center font-bold italic text-white [text-shadow:5px_5px_0px_black]">
          {countdown > 0 && <span className={`text-8xl`}>{countdown}</span>}
          {countdown === 0 && <span className="text-7xl">START</span>}
          <div className="absolute grid place-items-center">
            <img
              src="https://i.postimg.cc/d1LkLgVR/lightspread.png"
              alt="light"
              className="h-96 animate-spin opacity-90 [animation-duration:50000ms]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
