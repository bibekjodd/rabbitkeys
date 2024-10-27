'use client';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/use-game-store';

export default function GlowingBackGround() {
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  return (
    <>
      <div className="fixed inset-0 -z-20 flex flex-wrap overflow-hidden">
        {new Array(1000).fill('nothing').map((_, i) => (
          <div key={i} className="h-10 w-10 border border-gray-700/10" />
        ))}
      </div>
      <div
        className={cn('fixed inset-0 -z-10 transition-all', {
          'bg-black/60': isReady,
          'bg-black/70': isStarted,
          'bg-black/80': !isReady && !isStarted
        })}
      />
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="relative grid h-full w-full">
          <div className="animation-delay-1 glow absolute left-0 top-0 -z-20 aspect-square w-1/3 rounded-full bg-teal-500 mix-blend-multiply blur-3xl filter" />
          <div className="animation-delay-3 glow absolute right-0 top-0 -z-20 aspect-square w-1/3 rounded-full bg-emerald-500 mix-blend-multiply blur-3xl filter" />
          <div className="animation-delay-4 glow absolute bottom-0 left-0 -z-20 aspect-square w-1/3 rounded-full bg-cyan-500 mix-blend-multiply blur-3xl filter" />
          <div className="animation-delay-2 glow absolute bottom-0 right-0 -z-20 aspect-square w-1/3 rounded-full bg-purple-500 mix-blend-multiply blur-3xl filter" />
          <div className="glow absolute left-1/2 top-1/2 -z-20 aspect-square w-5/12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 mix-blend-multiply blur-3xl filter" />
        </div>
      </div>
    </>
  );
}
