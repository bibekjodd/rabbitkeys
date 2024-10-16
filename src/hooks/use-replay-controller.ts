import {
  pauseReplay,
  playReplay,
  skipReplayBackward,
  skipReplayForward,
  useReplayStore
} from '@/store/use-replay-store';
import { useCallback, useEffect } from 'react';

export const useReplayController = () => {
  const isStarted = useReplayStore((state) => state.isStarted);
  const isReady = useReplayStore((state) => state.isReady);

  const keyboardController = useCallback((e: KeyboardEvent) => {
    if (document.activeElement !== document.body) return;
    const { isPaused } = useReplayStore.getState();
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      skipReplayBackward();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      skipReplayForward();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (isPaused) playReplay();
      else pauseReplay();
    }
  }, []);

  useEffect(() => {
    if (isStarted && !isReady) {
      document.body.addEventListener('keydown', keyboardController);
    }
    return () => {
      document.body.removeEventListener('keydown', keyboardController);
    };
  }, [keyboardController, isReady, isStarted]);

  return null;
};
