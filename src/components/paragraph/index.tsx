'use client';
import { robotoMono } from '@/lib/fonts';
import { cn, scrollIntoView, wait } from '@/lib/utils';
import { nextParagraphKey } from '@/mutations/use-next-paragraph';
import { usePostResult } from '@/mutations/use-post-result';
import { paragraphKey, useParagraph } from '@/queries/use-paragraph';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { loadParagraph, onParagraphInput, useTypingStore } from '@/store/use-typing-store';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { ChevronsRight, Loader2, MonitorPlay, MousePointer } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const isTypedIncorrect = useTypingStore((state) => state.isTypedIncorrect);
  const isFetchingNextParagraph = !!useIsMutating({ mutationKey: nextParagraphKey });
  const letterIndex = typedText.length;
  const queryClient = useQueryClient();
  const { data: track } = useTrack();
  const {
    data: paragraph,
    isLoading: isLoadingParagraph,
    isFetching: isFetchingParagraph,
    error: paragraphError
  } = useParagraph(track?.paragraphId);
  const { mutate: updateResult } = usePostResult();

  const handleParagraphInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted || !isFocused) {
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
      scrollIntoView('typing-stats');
    });
    updateResult();
    queryClient.setQueryData(paragraphKey(null), null);
    const nextParagraph = queryClient.getQueryData(paragraphKey('next'));
    if (nextParagraph) {
      queryClient.setQueryData(paragraphKey(null), nextParagraph);
    } else {
      queryClient.invalidateQueries({ queryKey: paragraphKey(null) });
    }
  };

  useEffect(() => {
    if (paragraph) loadParagraph(paragraph);
  }, [paragraph]);

  const focusInput = useCallback(
    (e: KeyboardEvent) => {
      if (isFocused || !isStarted) return;
      e.preventDefault();
      document.getElementById('paragraph-input')?.focus();
    },
    [isFocused, isStarted]
  );

  useEffect(() => {
    document.body.addEventListener('keydown', focusInput);
    return () => {
      document.body.removeEventListener('keydown', focusInput);
    };
  }, [focusInput]);

  return (
    <div className="pb-36">
      <div className="relative p-4 pb-8">
        {graphics}
        <section
          onClick={() => document.getElementById('paragraph-input')?.focus()}
          className={cn(
            robotoMono.className,
            'relative mx-auto flex min-h-28 max-w-screen-lg flex-col whitespace-pre-wrap rounded-md bg-white/80 p-4 pb-14 shadow-2xl shadow-white/30 filter backdrop-blur-3xl focus:outline-none'
          )}
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

          {!isFocused && isStarted && (
            <label
              htmlFor="paragraph-input"
              className="absolute inset-0 z-50 grid place-items-center bg-black/10 text-gray-900 filter backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2">
                <MousePointer className="size-4 fill-gray-800" />
                <p className="font-medium">Click here or press any key to focus</p>
              </div>
            </label>
          )}

          {isStarted && (
            <Input
              disabled={!isStarted}
              value={previousInputRef.current}
              onChange={handleParagraphInput}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              autoFocus
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
        className={cn('aspect-square -skew-y-2 rounded-sm', {
          'bg-black': i % 2 === 0,
          'bg-white': i % 2 !== 0
        })}
      />
    ))}
  </div>
);
