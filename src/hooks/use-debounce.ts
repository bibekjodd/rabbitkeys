import { useEffect, useState } from 'react';

export const useDebounce = (dependency: unknown, delay: number) => {
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanStart(true);
    }, delay);

    return () => {
      setCanStart(false);
      clearTimeout(timeout);
    };
  }, [dependency, delay]);

  return canStart;
};
