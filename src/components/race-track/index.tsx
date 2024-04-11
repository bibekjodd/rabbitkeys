'use client';
import PlayerProgress from '../player-progress';
import { ZebraStripes } from '../utils/stripes';
import Countdown from './countdown';
import Graphics from './graphics';
import Timer from './timer';

export default function RaceTrack() {
  return (
    <div>
      <Timer />
      <section className="relative" id="race-track">
        <Graphics />
        <Countdown />
        <div className="relative overflow-hidden border-y-8 border-white/80 bg-neutral-700/70 py-10 sm:py-14">
          <ZebraStripes left />
          <ZebraStripes />
          <PlayerProgress />
        </div>
      </section>
    </div>
  );
}
