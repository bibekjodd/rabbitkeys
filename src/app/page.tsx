'use client';
import Paragraph from '@/components/paragraph';
import PlayerRanks from '@/components/player-ranks';
import RaceTrack from '@/components/race-track';
import Stats from '@/components/stats';
import InitialOverlay from '@/components/utils/initial-overlay';

export default function RacePage() {
  return (
    <main className="relative mx-auto grid w-full max-w-screen-xl flex-grow place-items-center pb-20">
      <div className="w-full">
        <InitialOverlay />

        <section className="flex min-h-screen w-full flex-col justify-center px-4 pt-16 md:px-10 xl:px-0">
          <div className="w-full">
            <RaceTrack />
            <Paragraph />
          </div>
        </section>
        <PlayerRanks />
        <Stats />
      </div>
    </main>
  );
}
