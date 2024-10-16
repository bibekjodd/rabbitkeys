import { useEffect } from 'react';

export const useTimeout = (
  callback: () => unknown,
  delay: number = 1000,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;
    const timeout = setTimeout(callback, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [callback, enabled, delay]);
};
