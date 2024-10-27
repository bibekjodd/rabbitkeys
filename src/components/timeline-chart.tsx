'use client';
import { chartColors } from '@/lib/constants';
import { robotoMono } from '@/lib/fonts';
import { useGameStore } from '@/store/use-game-store';
import { useTypingStore } from '@/store/use-typing-store';
import { AreaChart, MoveRight } from 'lucide-react';
import { useMemo } from 'react';
import { AxisOptions, Chart, UserSerie } from 'react-charts';

export default function TimelineChart() {
  const isFinished = useGameStore((state) => state.isFinished);
  if (!isFinished) return null;

  return (
    <section className="flex flex-col pl-12 pr-4">
      <h3 className="flex items-center space-x-4 pb-8 text-4xl font-bold text-slate-300/80">
        <span className={robotoMono.className}>Typing Stats</span>
        <AreaChart className="h-8 w-8" />
      </h3>
      {colorIndexes}
      <Graph />
      <div className="mx-auto flex w-fit items-center space-x-2 pt-2 text-sm text-slate-400">
        <span>
          Time <span className="font-normal italic">(seconds)</span>
        </span>
        <MoveRight className="h-4 w-4 translate-y-0.5" />
      </div>
    </section>
  );
}

const colorIndexes = (
  <div className="ml-auto flex w-fit space-x-4 text-slate-400">
    <div className="flex items-center space-x-2">
      <span className="text-sm">Accuracy</span>
      <span
        className="h-4 w-4 rounded-sm border-2 border-gray-300"
        style={{ backgroundColor: chartColors.accuracy }}
      />
    </div>

    <div className="flex items-center space-x-2">
      <span className="text-sm">Speed</span>
      <span
        className="h-4 w-4 rounded-sm border-2 border-gray-300"
        style={{ backgroundColor: chartColors.speed }}
      />
    </div>

    <div className="flex items-center space-x-2">
      <span className="text-sm">Error</span>
      <span
        className="h-4 w-4 rounded-sm border-2 border-gray-300"
        style={{ backgroundColor: chartColors.error }}
      />
    </div>
  </div>
);

function Graph() {
  const timeline = useTypingStore((state) => state.timeline);
  type Data = {
    value: number;
    duration: number;
  };

  const data = useMemo((): UserSerie<Data>[] => {
    const speedTimelineData: Data[] = timeline.map((data) => ({
      value: data.speed,
      duration: data.duration / 1000
    }));
    const accuracyTimelineData: Data[] = timeline.map((data) => ({
      value: data.accuracy,
      duration: data.duration / 1000
    }));
    const errorCountTimelineData: Data[] = timeline.map((data) => ({
      value: data.errorsCount,
      duration: data.duration / 1000
    }));
    return [
      { label: 'Speed', data: speedTimelineData, id: 'speed' },
      { label: 'Accuracy', data: accuracyTimelineData, id: 'accuracy' },
      { label: 'Errors', data: errorCountTimelineData, id: 'error' }
    ];
  }, [timeline]);

  const primaryAxis: AxisOptions<Data> = { getValue: (data) => data.duration };
  const secondaryAxes: AxisOptions<Data>[] = [{ getValue: (data) => data.value }];

  return (
    <div className="relative h-80 w-full">
      <p className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-slate-400">
        Speed & Accuracy
      </p>

      <Chart
        options={{
          data: data,
          primaryAxis,
          secondaryAxes,
          dark: true,
          getSeriesStyle(series) {
            return {
              color: chartColors[series.id as keyof typeof chartColors]
            };
          }
        }}
      />
    </div>
  );
}
