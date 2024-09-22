import { robotoMono } from '@/lib/fonts';
import { formatDuration, getRankSuffix } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useEffect, useState } from 'react';

export default function PlayerRanks() {
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const isFinished = useGameStore((state) => state.isFinished);
  if (!isMultiplayer || !isFinished) return;
  return <Main />;
}

function Main() {
  const { data: track } = useTrack();
  const { data: profile } = useProfile();
  const [result, setResult] = useState<Track['players'] | null>(null);

  useEffect(() => {
    if (track?.isFinished && !result) {
      setResult([...track.players].sort((a, b) => (a.position || 0) - (b.position || 0)));
    }
  }, [track?.players, track?.isFinished, result]);

  if (!result || !track) return;
  const myStats = track.players.find((player) => player.id === profile?.id);

  return (
    <section id="player-ranks" className="mx-auto mb-40 w-full max-w-screen-xl px-4 pt-10">
      <div className="mb-5 flex w-fit items-center text-xl font-semibold">
        <h1 className="bg-sky-500 px-4 py-3 pr-16">Race Results</h1>
        <span className="-translate-x-8 -skew-x-12 bg-white px-4 py-3 font-bold text-gray-800">
          {myStats?.position}
          <sup>{getRankSuffix(myStats?.position || track.players.length)}</sup>
        </span>
      </div>

      <table className={`${robotoMono.className} text-sm lg:text-base`}>
        <tbody className="text-center">
          <tr className="h-20 border-y border-gray-600 text-gray-300">
            <th className="px-6 font-medium">Rank</th>
            <th className="font-medium">Vehicle</th>
            <th className="font-medium">Player</th>
            <th className="font-medium text-green-500">Accuracy</th>
            <th className="font-medium text-sky-500">Average speed</th>
            <th className="font-medium text-purple-500">Top Speed</th>
            <th className="font-medium text-yellow-500">Duration</th>
          </tr>

          {result.map((player) => (
            <Player key={player.id} player={player} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Player({ player }: { player: PlayerState }) {
  return (
    <tr className="h-20 border-b border-gray-600">
      <td className="font-medium text-gray-200">{player.position}</td>
      <td className="min-w-20 px-6">
        <img src={player.carImage!} alt="vehicle image" className="w-20 object-contain" />
      </td>
      <td className="px-6 text-gray-200 lg:px-12 xl:px-16">{player.name}</td>
      <td className="px-6 text-green-500 lg:px-12 xl:px-16">{Math.round(player.accuracy || 0)}%</td>
      <td className="px-6 text-sky-500 lg:px-12 xl:px-16">{Math.round(player.speed || 0)} wpm</td>
      <td className="px-6 text-purple-500 lg:px-12 xl:px-16">
        {Math.round(player.topSpeed || 0)} wpm
      </td>
      <td className="px-6 text-yellow-500 lg:px-12 xl:px-16">
        {formatDuration(Number(player.duration) * 1000)}
      </td>
    </tr>
  );
}
