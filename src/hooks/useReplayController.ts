import { useReplayStore } from '@/store/useReplayStore';
import { useCallback, useEffect } from 'react';

export const useReplayController = () => {
  const isStarted = useReplayStore((state) => state.isStarted);
  const isReady = useReplayStore((state) => state.isReady);

  const keyboardController = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if (document.activeElement !== document.body) return;
    const { skipBackward, skipForward, pause, isPaused, play } = useReplayStore.getState();
    if (e.key === 'ArrowLeft') {
      skipBackward();
    } else if (e.key === 'ArrowRight') {
      skipForward();
    } else if (e.key === ' ') {
      if (isPaused) play();
      else pause();
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
