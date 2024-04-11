import { useReplayController } from '@/hooks/useReplayController';
import { useTimeout } from '@/hooks/useTimeout';
import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';
import { MoveLeft, MoveRight, Play, Space } from 'lucide-react';
import { useMemo, useState } from 'react';
import BaseParagraph from './base-paragraph';

export default function ReplayParagraph() {
  const isReplayAvailable = useReplayStore((state) => state.isReplayAvailable);
  const isStarted = useReplayStore((state) => state.isStarted);
  const isFinished = useGameStore((state) => state.isFinished);
  if (!isReplayAvailable || !isStarted || !isFinished) return null;
  return <Main />;
}

function Main() {
  const isStarted = useReplayStore((state) => state.isStarted);
  const paragraph = useReplayStore((state) => state.paragraph);
  const currentIndex = useReplayStore((state) => state.currentIndex);
  const data = useReplayStore((state) => state.data);
  useReplayController();

  return (
    <>
      <BaseParagraph
        isFocused={true}
        isStarted={isStarted}
        paragraph={paragraph}
        letterIndex={data[currentIndex]?.index || 0}
        isTypedIncorrect={data[currentIndex]?.isTypedIncorrect || false}
      />
      <PreviewCurrentTyping />
    </>
  );
}

function PreviewCurrentTyping() {
  const isReady = useReplayStore((state) => state.isReady);
  const isPaused = useReplayStore((state) => state.isPaused);
  const data = useReplayStore((state) => state.data);
  const currentIndex = useReplayStore((state) => state.currentIndex);
  const [canShowData, setCanShowData] = useState(false);

  const currentlyTypedText = useMemo(() => {
    setCanShowData(true);
    let length = currentIndex - 9;
    if (length < 0) length = 0;
    return data.slice(length, currentIndex + 1);
  }, [currentIndex, data]);

  useTimeout(
    () => {
      setCanShowData(false);
    },
    1000,
    !isPaused
  );

  if (!canShowData || isReady) return null;

  return (
    <>
      {isPaused && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <Play className="h-5 w-5 fill-gray-800 text-gray-700" />
          <span className="font-medium text-gray-700">Paused</span>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-sm font-medium text-gray-800">
        <span>Press</span>
        <span className="rounded-md bg-gray-700 px-1 py-0.5 text-white">
          <MoveLeft className="h-4 w-4 " />
        </span>
        <span className="rounded-md bg-gray-700 px-1 py-0.5 text-white">
          <Space className="h-4 w-4 " />
        </span>
        <span className="rounded-md bg-gray-700 px-1 py-0.5 text-white">
          <MoveRight className="h-4 w-4 " />
        </span>
        <span>to skip/pause replay</span>
      </div>

      <section className="absolute left-0 top-full z-50 w-full overflow-x-auto pt-3">
        <div className="mx-auto flex w-fit space-x-2 font-black">
          {currentlyTypedText.map((snapshot, i) => {
            if (snapshot.typed)
              return (
                <div
                  key={i}
                  className={`block flex-shrink-0 rounded-lg border border-gray-600 bg-black/30 p-2 text-4xl lg:p-4 lg:text-6xl
                  ${snapshot.isTypedIncorrect ? 'text-rose-600' : 'text-white'}
                  `}
                >
                  {snapshot.typed === ' ' ? ' ' : snapshot.typed}
                </div>
              );
          })}
        </div>
      </section>
    </>
  );
}
