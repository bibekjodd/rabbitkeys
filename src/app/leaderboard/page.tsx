'use client';
import { robotoMono } from '@/lib/fonts';
import { useLeaderboard } from '@/queries/use-leaderboard';
import { LineChart } from 'lucide-react';
import React, { useState } from 'react';

export default function Page() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const [isListExpanded, setIsListExpanded] = useState(false);

  return (
    <main className="mb-20 mt-5 px-4">
      <div className="mx-auto w-full max-w-screen-xl">
        <h3 className="my-4 flex items-center space-x-3 text-2xl font-semibold text-gray-200">
          <span>All time Leaderboard</span>
          <LineChart className="h-6 w-6" />
        </h3>
        <table className={`${robotoMono.className} w-full overflow-x-auto text-sm lg:text-base`}>
          <tbody className="text-center">
            <tr className="h-20 border-y border-gray-600 text-gray-300">
              <th className="px-4 font-medium">Rank</th>
              <th className="px-6 font-medium lg:px-12 xl:px-16">Vehicle</th>
              <th className="px-6 font-medium lg:px-12 xl:px-16">Player</th>
              <th className="px-6 font-medium text-sky-500 lg:px-12 xl:px-16">Accuracy</th>
              <th className="px-6 font-medium text-sky-500 lg:px-12 xl:px-16">Speed</th>
              <th className="px-6 font-medium text-purple-500 lg:px-12 xl:px-16">Top Speed</th>
              <th className="px-6 text-gray-300">On</th>
            </tr>

            {isLoading &&
              new Array(4)
                .fill('nothing')
                .map((_, i) => <React.Fragment key={i}>{skeleton}</React.Fragment>)}
            {leaderboard
              ?.slice(0, isListExpanded ? 20 : 10)
              .map((data, i) => <Player key={i} rank={i + 1} details={data} />)}
          </tbody>
        </table>

        {!isListExpanded && (leaderboard?.length || 0) > 10 && (
          <div className="m-5 flex justify-center">
            <button
              className="text-gray-200 hover:underline"
              onClick={() => setIsListExpanded(true)}
            >
              See More
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Player({ details, rank }: { rank: number; details: Leaderboard[number] }) {
  const { user, speed, accuracy, topSpeed, createdAt } = details;
  return (
    <tr className="h-20 border-b border-gray-600">
      <td className="font-medium text-gray-200">{rank}</td>
      <td>
        <img src={user.carImage!} alt="vehicle image" className="mx-auto w-20 object-contain" />
      </td>
      <td className="text-gray-200">{user.name}</td>
      <td className="text-green-500">{Math.round(accuracy)}%</td>
      <td className="text-sky-500">{Math.round(speed || 0)} wpm</td>
      <td className="text-purple-500">{Math.round(topSpeed)} wpm</td>
      <td className="text-gray-300">{new Date(createdAt).toISOString().slice(0, 10)}</td>
    </tr>
  );
}

const skeleton = (
  <tr className="h-20 border-b border-gray-600">
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-8 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
  </tr>
);
