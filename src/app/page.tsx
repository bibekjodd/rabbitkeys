'use client';
import Paragraph from '@/components/paragraph';
import PlayerRanks from '@/components/player-ranks';
import RaceTrack from '@/components/race-track';
import Stats from '@/components/stats';
import InitialOverlay from '@/components/utils/initial-overlay';
import PreloadImages from '@/components/utils/preload-images';

export default function RacePage() {
  return (
    <main className="relative mx-auto grid w-full max-w-screen-xl flex-grow place-items-center pb-10">
      <div className="w-full">
        <PreloadImages />
        <InitialOverlay />

        <section className="flex min-h-screen w-full flex-col justify-center px-4 md:px-10 xl:px-0">
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
