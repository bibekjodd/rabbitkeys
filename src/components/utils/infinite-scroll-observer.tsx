import { useEffect, useRef } from 'react';

type Props = { isFetching: boolean; hasNextPage: boolean; fetchNextPage: () => unknown };
export default function InfiniteScrollObserver({ fetchNextPage, hasNextPage, isFetching }: Props) {
  const observerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const targetElement = observerRef.current;
    if (!targetElement) return;

    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.at(0)?.isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  return <span ref={observerRef} />;
}
