import { useEffect } from 'react';

export const useInterval = (callback: () => unknown, delay: number, enabled: boolean) => {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (enabled) {
      interval = setInterval(() => {
        callback();
      }, delay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enabled, callback, delay]);
};
