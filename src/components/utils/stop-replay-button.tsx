import { stopReplay, useReplayStore } from '@/store/use-replay-store';
import React, { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function StopReplayButton({ onClick, children, ...props }: Props) {
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const isReplayReady = useReplayStore((state) => state.isReady);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    stopReplay();
  };

  if (!isReplayStarted || isReplayReady) return null;

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
