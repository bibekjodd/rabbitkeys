'use client';
import { robotoMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { useResults } from '@/queries/use-results';
import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';

type Props = { children: React.ReactNode };
export default function ResultsDialog({ children }: Props) {
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useResults();
  const results = data?.pages.flat() || [];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-screen-md pb-3">
        <DialogHeader>
          <DialogTitle className="pb-2 text-center">Results</DialogTitle>
        </DialogHeader>

        {!isLoading && !results.length && (
          <p className="text-gray-300">No results to show right now!</p>
        )}

        <div className="max-h-96 w-full overflow-y-auto pr-4">
          {!isLoading && results.length > 0 && (
            <table className={cn('text-cneter w-full text-sm', robotoMono.className)}>
              <tbody>
                <tr>
                  <th className="px-4 py-2">Mode</th>
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2 text-green-500">Accuracy</th>
                  <th className="px-4 py-2 text-sky-500">Average Speed</th>
                  <th className="px-4 py-2 text-purple-500">Top Speed</th>
                  <th className="px-4 py-2 text-yellow-500">On</th>
                </tr>
                {results?.map((result) => <Result key={result.id} result={result} />)}
                {(isLoading || isFetchingNextPage) &&
                  new Array(6)
                    .fill('nothin')
                    .map((_, i) => <React.Fragment key={i}>{skeleton}</React.Fragment>)}
              </tbody>
            </table>
          )}
          <InfiniteScrollObserver
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Result({ result }: { result: Result }) {
  return (
    <tr className="h-10">
      <td>
        {result.isMultiplayer ? (
          <span className="rounded-md bg-gray-300 p-1 text-xs font-semibold text-gray-700">
            Multiplayer
          </span>
        ) : (
          <span className="rounded-md bg-gray-700 p-1 text-xs font-semibold text-gray-200">
            Singleplayer
          </span>
        )}
      </td>
      <td>{result.isMultiplayer ? result.position : '-'}</td>
      <td className="font-medium text-green-500">{Math.round(result.accuracy)}%</td>
      <td className="font-medium text-sky-500">{Math.round(result.speed)} wpm</td>
      <td className="font-medium text-purple-500">{Math.round(result.topSpeed)} wpm</td>
      <td className="font-medium text-yellow-500">
        {new Date(result.createdAt).toISOString().slice(0, 10)}
      </td>
    </tr>
  );
}

const skeleton = (
  <tr className="h-10">
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
    <td>
      <div className="h-6 w-10/12 animate-pulse rounded-md bg-gray-700" />
    </td>
  </tr>
);
