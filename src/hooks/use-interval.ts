import { useEffect } from 'react';

export const useInterval = (callback: Function, delay: number, enabled: boolean) => {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (enabled) {
      interval = setInterval(() => {
        callback();
      }, delay);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [enabled, callback, delay]);
};
