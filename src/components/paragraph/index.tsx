'use client';
import { robotoMono } from '@/lib/fonts';
import { wait } from '@/lib/utils';
import { useUpdateResult } from '@/mutations/useUpdateResult';
import { useParagraph } from '@/queries/useParagraph';
import { useTrack } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { useReplayStore } from '@/store/useReplayStore';
import { useTypingStore } from '@/store/useTypingStore';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { ChevronsRight, Loader2, MonitorPlay } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import NextParagraphButton from '../utils/next-paragraph-button';
import WatchReplayButton from '../utils/watch-replay-button';
import BaseParagraph from './base-paragraph';
import ReplayParagraph from './replay-paragraph';

export default function Paragraph() {
  const previousInputRef = useRef('');
  const [isFocused, setIsFocused] = useState(false);
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const typedText = useTypingStore((state) => state.typedText);
  const loadParagraph = useTypingStore((state) => state.loadParagraph);
  const onParagraphInput = useTypingStore((state) => state.onParagraphInput);
  const isTypedIncorrect = useTypingStore((state) => state.isTypedIncorrect);
  const isFetchingNextParagraph = !!useIsMutating({ mutationKey: ['next-paragraph'] });
  const letterIndex = typedText.length;
  const queryClient = useQueryClient();
  const { data: track } = useTrack();
  const {
    data: paragraph,
    isLoading: isLoadingParagraph,
    isFetching: isFetchingParagraph,
    error: paragraphError
  } = useParagraph(track?.paragraphId);
  const { mutate: updateResult } = useUpdateResult();

  const handleParagraphInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) {
      previousInputRef.current = '';
      return;
    }
    const previousInput = previousInputRef.current;
    const currentInput = e.target.value;
    previousInputRef.current = currentInput;
    if (previousInput.length > currentInput.length) return;

    const isFinished = onParagraphInput(currentInput.slice(-1));
    if (!isFinished) return;

    previousInputRef.current = '';
    const { isMultiplayer } = useGameStore.getState();
    if (isMultiplayer) return;
    wait(100).then(() => {
      document.getElementById('stats')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    updateResult();
    queryClient.setQueryData(['paragraph', null], null);
    const nextParagraph = queryClient.getQueryData(['paragraph', 'next']);
    if (nextParagraph) {
      queryClient.setQueryData(['paragraph', null], nextParagraph);
    } else {
      queryClient.invalidateQueries({ queryKey: ['paragraph', null] });
    }
  };

  useEffect(() => {
    if (paragraph) loadParagraph(paragraph);
  }, [paragraph, loadParagraph]);

  return (
    <div className="pb-44">
      <div className="relative p-4 pb-8">
        {graphics}
        <section
          onClick={() => document.getElementById('paragraph-input')?.focus()}
          className={`${robotoMono.className} relative mx-auto flex min-h-28 max-w-screen-lg flex-col whitespace-pre-wrap rounded-md bg-white/80 p-4 pb-14 shadow-2xl shadow-white/30 filter backdrop-blur-3xl focus:outline-none`}
          id="paragraph"
        >
          {!isReplayStarted && (
            <BaseParagraph
              isFocused={isFocused}
              isStarted={isStarted}
              isTypedIncorrect={isTypedIncorrect}
              letterIndex={letterIndex}
              paragraph={paragraph}
            />
          )}
          {isReplayStarted && <ReplayParagraph />}

          {isStarted && (
            <Input
              value={previousInputRef.current}
              onChange={handleParagraphInput}
              autoComplete="off"
              id="paragraph-input"
              className="absolute inset-0 bg-transparent opacity-0"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          )}

          {paragraphError && (
            <div className="absolute inset-0 bg-black/10 p-4 text-black filter backdrop-blur-sm">
              <span className="text-sm font-medium text-rose-500">
                Could not load paragraph! {paragraphError.message}
              </span>
            </div>
          )}

          {(isLoadingParagraph ||
            isFetchingParagraph ||
            (!isReady && !isStarted && isFetchingNextParagraph)) && (
            <div className="absolute inset-0 flex items-center justify-center space-x-3 bg-black/10 text-black filter backdrop-blur-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading paragraph...</span>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex items-center space-x-3">
            <WatchReplayButton className="flex items-center space-x-2 rounded-md bg-gray-800/90 px-3 py-1 text-sm">
              <span>Watch Replay</span>
              <MonitorPlay className="h-4 w-4" />
            </WatchReplayButton>

            <NextParagraphButton className="flex items-center space-x-2 rounded-md bg-gray-800/90 px-3 py-1 text-sm">
              <span>Next Paragraph</span>
              <ChevronsRight className="h-5 w-5" />
            </NextParagraphButton>
          </div>
        </section>
      </div>
    </div>
  );
}

const graphics = (
  <div className="absolute inset-0 -z-10 grid grid-cols-[repeat(25,_minmax(0,_1fr))] overflow-hidden opacity-10 blur-sm filter">
    {new Array(300).fill('empty').map((_, i) => (
      <div
        key={i}
        className={`aspect-square -skew-y-2 rounded-sm ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
      />
    ))}
  </div>
);
