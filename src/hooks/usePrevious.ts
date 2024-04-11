import { useEffect, useRef } from 'react';

export const usePrevious = <T = unknown>(data: T): T | null => {
  const ref = useRef<T | null>(data);
  useEffect(() => {
    ref.current = data;
  }, [data]);
  return ref.current;
};
