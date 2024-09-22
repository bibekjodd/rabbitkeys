import { scrollIntoView, wait } from '@/lib/utils';
import { create } from 'zustand';
import { useGameStore } from './use-game-store';

export type Snapshot = {
  letter: string;
  index: number;
  duration: number;
  isTypedIncorrect: boolean;
  speed: number;
  accuracy: number;
  typed: string;
};
interface ReplayStore {
  paragraph: Paragraph | null;
  currentIndex: number;
  data: Snapshot[];
  isReady: boolean;
  isStarted: boolean;
  countdown: number;
  isPaused: boolean;

  isReplayAvailable: boolean;
  playTimeoutRef: NodeJS.Timeout | null;
  playDelayTimeoutRef: NodeJS.Timeout | null;

  updateSnapshot: (snapshot: Snapshot) => void;
  start: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  onPlay: () => void;

  skipForward: () => void;
  skipBackward: () => void;
  seek: (index: number) => void;

  onTypingStart: () => void;
  onTypingComplete: (paragraph: Paragraph) => void;
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
  paragraph: null,
  data: [],
  currentIndex: 0,
  isReady: false,
  isStarted: false,
  countdown: 3,
  isPaused: false,
  isReplayAvailable: false,
  playTimeoutRef: null,
  playDelayTimeoutRef: null,

  updateSnapshot(snapshot) {
    let { data, isStarted, isReplayAvailable, isReady } = get();
    if (isStarted || isReady || isReplayAvailable) return;
    set({ data: [...data, snapshot] });
  },

  async start() {
    const { isReady, isStarted, stop, isReplayAvailable, paragraph, data } = get();
    if (!isReplayAvailable || !paragraph || !data.length) {
      return stop();
    }
    if (!isReady || !isStarted) {
      stop();
    }
    if (isStarted || isReady) return;
    scrollIntoView('body');
    set({ isStarted: true, isPaused: false, countdown: 3, isReady: true, currentIndex: 0 });
    await wait(1000);
    set({ countdown: 2 });
    await wait(1000);
    set({ countdown: 1 });
    await wait(1000);
    set({ countdown: 0 });
    await wait(500);
    set({ isReady: false, isStarted: true, isPaused: false, currentIndex: 0 });
    scrollIntoView('body');
    get().onPlay();
  },

  pause() {
    const { isReady, isStarted, playTimeoutRef } = get();
    if (!isStarted || isReady) return;
    playTimeoutRef && clearTimeout(playTimeoutRef);
    set({ isPaused: true, playTimeoutRef: null });
  },

  play() {
    const { isReady, isStarted, playTimeoutRef, onPlay } = get();
    if (!isStarted || isReady) return;
    playTimeoutRef && clearTimeout(playTimeoutRef);
    set({ isPaused: false, playTimeoutRef: null });
    onPlay();
  },

  stop() {
    const { isReady, isStarted, playTimeoutRef } = get();
    if (!isStarted || isReady) return;
    playTimeoutRef && clearTimeout(playTimeoutRef);
    set({
      isStarted: false,
      isPaused: false,
      countdown: 3,
      isReady: false,
      playTimeoutRef: null
    });
  },

  restart() {
    if (get().isReady) return;
    get().stop();
    get().start();
  },

  onPlay() {
    const { isPaused, isStarted, data, currentIndex, stop, isReady, playTimeoutRef, onPlay } =
      get();
    playTimeoutRef && clearTimeout(playTimeoutRef);
    set({ playTimeoutRef: null });
    if (!isStarted || isPaused || isReady) {
      return;
    }
    if (currentIndex >= data.length) {
      return stop();
    }

    let delay = 0;
    if (currentIndex <= 0) {
      delay = data[0].duration;
    } else {
      delay = data[currentIndex].duration - data[currentIndex - 1].duration;
    }
    if (delay < 0) delay = 0;
    const currentTimeoutRef = setTimeout(() => {
      set({ currentIndex: currentIndex + 1 });
      onPlay();
    }, delay);
    set({ playTimeoutRef: currentTimeoutRef });
  },

  skipBackward() {
    const { currentIndex, data, seek } = get();
    let targetIndex = currentIndex;
    while (targetIndex > 0) {
      targetIndex--;
      if (data[targetIndex].typed === ' ' && data[targetIndex].letter === ' ') {
        break;
      }
    }
    seek(targetIndex);
  },

  skipForward() {
    const { currentIndex, data, seek } = get();
    let targetIndex = currentIndex;
    while (targetIndex < data.length - 1) {
      targetIndex++;
      if (data[targetIndex].typed === ' ' && data[targetIndex].letter === ' ') {
        break;
      }
    }
    seek(targetIndex);
  },

  seek(index) {
    const { playTimeoutRef, playDelayTimeoutRef, data, onPlay } = get();
    playTimeoutRef && clearTimeout(playTimeoutRef);
    playDelayTimeoutRef && clearTimeout(playDelayTimeoutRef);
    set({ playTimeoutRef: null, playDelayTimeoutRef: null });

    if (index < 0) index = 0;
    if (index >= data.length) {
      index = data.length - 1;
    }

    set({ currentIndex: index });
    const newPlayDelayTimeoutRef = setTimeout(() => {
      onPlay();
    }, 300);
    set({ playDelayTimeoutRef: newPlayDelayTimeoutRef });
  },

  onTypingStart() {
    set({ isReplayAvailable: false, data: [] });
  },

  onTypingComplete(paragraph) {
    set({ isReplayAvailable: !useGameStore.getState().isMultiplayer, currentIndex: 0, paragraph });
  }
}));
