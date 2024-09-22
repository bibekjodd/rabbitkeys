import { useEffect } from 'react';

export const useTimeout = (callback: () => any, delay: number = 1000, enabled: boolean = true) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (enabled) {
      timeout = setTimeout(callback, delay);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [callback, enabled, delay]);
};
