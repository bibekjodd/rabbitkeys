import { clearGame, endGame, switchMode, useGameStore } from '@/store/use-game-store';
import { useLiveScore } from '@/store/use-live-score';
import { Snapshot, updateReplaySnapshot } from '@/store/use-replay-store';
import { TimelineData, useTypingStore } from '@/store/use-typing-store';
import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { backendUrl } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const redirectToLogin = () => {
  window.open(`${backendUrl}/api/auth/login/google?redirect=${location.origin}`);
};

export const wait = async (duration?: number): Promise<boolean> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, duration || 1000);
  });
};

export const scrollIntoView = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const scrollLength = element.offsetTop;
  window.scroll({ top: scrollLength, behavior: 'smooth' });
};

export const extractErrorMessage = (err: unknown): string => {
  const message = 'Unknown error occurred';
  if (err instanceof AxiosError) {
    return err.response?.data?.message || err.message || message;
  }
  if (err instanceof Error) {
    return err.message || message;
  }
  return message;
};

export const getUsername = (email: string) => {
  return email.slice(0, email.indexOf('@'));
};

export const validateUrl = (url: string): URL | null => {
  try {
    return new URL(url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export const formatDuration = (duration: number): string => {
  duration /= 1000;
  let minutes = Math.floor(duration / 60).toString();
  if (minutes.length === 1) minutes = '0' + minutes;
  let seconds = Math.round(duration % 60).toString();
  if (seconds.length === 1) seconds = '0' + seconds;
  return `${minutes}: ${seconds}`;
};

export const canStartAfterDelay = () => {
  let { canStartTimeoutRef } = useGameStore.getState();
  if (canStartTimeoutRef) clearTimeout(canStartTimeoutRef);
  canStartTimeoutRef = setTimeout(() => {
    useGameStore.setState({ canStart: true });
  }, 3000);
  useGameStore.setState({ canStartTimeoutRef, canStart: false });
};

export const updateSpeed = () => {
  const { startedAt, isFinished } = useGameStore.getState();
  if (!startedAt || isFinished) return;
  const duration = (Date.now() - new Date(startedAt).getTime()) / 60_000;
  if (!duration) return;

  const { typedText, topSpeed } = useTypingStore.getState();
  const totalWords = typedText.split(' ').length - 1;
  const speed = totalWords / duration;
  useTypingStore.setState({ speed });
  if (speed > topSpeed) {
    useTypingStore.setState({ topSpeed: speed });
  }
  const progress = useTypingStore.getState().progress;
  useLiveScore.getState().updateScore({ playerId: '', progress, speed });
};

export const updateTimeline = () => {
  const { startedAt } = useGameStore.getState();
  if (!startedAt) return;
  let { duration, timeline } = useTypingStore.getState();
  const { errorsCount, progress, totalErrorsCount, isTypedIncorrect, speed, typedText, paragraph } =
    useTypingStore.getState();
  duration ||= 0;
  duration += 1000;
  let accuracy = (typedText.length * 100) / (typedText.length + totalErrorsCount);
  accuracy = Math.round(Number(accuracy)) || 100;

  const timelineData: TimelineData = {
    speed,
    errorsCount,
    progress,
    duration,
    accuracy
  };
  if (timeline.length === 0) {
    timeline = [{ accuracy: 100, errorsCount: 0, progress: 0, speed: 0, duration: 0 }];
  }
  timeline = [...timeline, timelineData];
  useTypingStore.setState({ duration, timeline, errorsCount: 0 });
  const replaySnapshot: Snapshot = {
    accuracy,
    duration: duration,
    index: typedText.length,
    isTypedIncorrect,
    speed,
    typed: '',
    letter: paragraph?.text[typedText.length]!
  };
  updateReplaySnapshot(replaySnapshot);
};

export const getRankSuffix = (rank: number): 'st' | 'nd' | 'rd' | 'th' => {
  if (rank >= 11 && rank <= 13) return 'th';
  if (rank % 10 === 1) return 'st';
  if (rank % 10 === 2) return 'nd';
  if (rank % 10 === 3) return 'rd';
  return 'th';
};

export const stopGameOnMaxTimeout = () => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const maxTimeoutRef = setTimeout(() => {
    const { isStarted } = useGameStore.getState();
    if (!isStarted) return;
    toast.info('Game must be completed within 5 minutes! Exitting current game', {
      duration: 5000
    });
    endGame();
    clearGame();
    switchMode({ isMultiplayer: false });
  }, FIVE_MINUTES);
  useGameStore.setState({ maxTimeoutRef });
};

export const clearGameTimeout = () => {
  const { maxTimeoutRef } = useGameStore.getState();
  if (maxTimeoutRef) clearTimeout(maxTimeoutRef);
  useGameStore.setState({ maxTimeoutRef: null });
};
