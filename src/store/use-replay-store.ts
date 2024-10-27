import { scrollIntoView, wait } from '@/lib/utils';
import { createStore } from '@jodd/snap';

export type Snapshot = {
  letter: string;
  index: number;
  duration: number;
  isTypedIncorrect: boolean;
  speed: number;
  accuracy: number;
  typed: string;
};
interface ReplayStore {
  paragraph: Paragraph | null;
  currentIndex: number;
  data: Snapshot[];
  isReady: boolean;
  isStarted: boolean;
  countdown: number;
  isPaused: boolean;

  isReplayAvailable: boolean;
  playTimeoutRef: NodeJS.Timeout | null;
  playDelayTimeoutRef: NodeJS.Timeout | null;
}

export const useReplayStore = createStore<ReplayStore>(() => ({
  paragraph: null,
  data: [],
  currentIndex: 0,
  isReady: false,
  isStarted: false,
  countdown: 3,
  isPaused: false,
  isReplayAvailable: false,
  playTimeoutRef: null,
  playDelayTimeoutRef: null
}));

export function updateReplaySnapshot(snapshot: Snapshot) {
  const { data, isStarted, isReplayAvailable, isReady } = useReplayStore.getState();
  if (isStarted || isReady || isReplayAvailable) return;
  useReplayStore.setState({ data: [...data, snapshot] });
}

export async function startReplay() {
  const { isReady, isStarted, isReplayAvailable, paragraph, data } = useReplayStore.getState();
  if (!isReplayAvailable || !paragraph || !data.length) {
    return stopReplay();
  }
  if (!isReady || !isStarted) {
    stopReplay();
  }
  if (isStarted || isReady) return;
  scrollIntoView('body');
  useReplayStore.setState({
    isStarted: true,
    isPaused: false,
    countdown: 3,
    isReady: true,
    currentIndex: 0
  });
  await wait(1000);
  useReplayStore.setState({ countdown: 2 });
  await wait(1000);
  useReplayStore.setState({ countdown: 1 });
  await wait(1000);
  useReplayStore.setState({ countdown: 0 });
  await wait(500);
  useReplayStore.setState({ isReady: false, isStarted: true, isPaused: false, currentIndex: 0 });
  scrollIntoView('body');
  onPlayReplay();
}

export function pauseReplay() {
  const { isReady, isStarted, playTimeoutRef } = useReplayStore.getState();
  if (!isStarted || isReady) return;
  if (playTimeoutRef) clearTimeout(playTimeoutRef);
  useReplayStore.setState({ isPaused: true, playTimeoutRef: null });
}

export function playReplay() {
  const { isReady, isStarted, playTimeoutRef } = useReplayStore.getState();
  if (!isStarted || isReady) return;
  if (playTimeoutRef) clearTimeout(playTimeoutRef);
  useReplayStore.setState({ isPaused: false, playTimeoutRef: null });
  onPlayReplay();
}

export function stopReplay() {
  const { isReady, isStarted, playTimeoutRef } = useReplayStore.getState();
  if (!isStarted || isReady) return;
  if (playTimeoutRef) clearTimeout(playTimeoutRef);
  useReplayStore.setState({
    isStarted: false,
    isPaused: false,
    countdown: 3,
    isReady: false,
    playTimeoutRef: null
  });
}

export function restartReplay() {
  if (useReplayStore.getState().isReady) return;
  stopReplay();
  startReplay();
}

function onPlayReplay() {
  const { isPaused, isStarted, data, currentIndex, isReady, playTimeoutRef } =
    useReplayStore.getState();
  if (playTimeoutRef) clearTimeout(playTimeoutRef);
  useReplayStore.setState({ playTimeoutRef: null });
  if (!isStarted || isPaused || isReady) {
    return;
  }
  if (currentIndex >= data.length) {
    return stopReplay();
  }

  let delay = 0;
  if (currentIndex <= 0) {
    delay = data[0].duration;
  } else {
    delay = data[currentIndex].duration - data[currentIndex - 1].duration;
  }
  if (delay < 0) delay = 0;
  const currentTimeoutRef = setTimeout(() => {
    useReplayStore.setState({ currentIndex: currentIndex + 1 });
    onPlayReplay();
  }, delay);
  useReplayStore.setState({ playTimeoutRef: currentTimeoutRef });
}

export function skipReplayBackward() {
  const { currentIndex, data } = useReplayStore.getState();
  let targetIndex = currentIndex;
  while (targetIndex > 0) {
    targetIndex--;
    if (data[targetIndex].typed === ' ' && data[targetIndex].letter === ' ') {
      break;
    }
  }
  seekReplay(targetIndex);
}

export function skipReplayForward() {
  const { currentIndex, data } = useReplayStore.getState();
  let targetIndex = currentIndex;
  while (targetIndex < data.length - 1) {
    targetIndex++;
    if (data[targetIndex].typed === ' ' && data[targetIndex].letter === ' ') {
      break;
    }
  }
  seekReplay(targetIndex);
}

export function seekReplay(index: number) {
  const { playTimeoutRef, playDelayTimeoutRef, data } = useReplayStore.getState();
  if (playTimeoutRef) clearTimeout(playTimeoutRef);
  if (playDelayTimeoutRef) clearTimeout(playDelayTimeoutRef);
  useReplayStore.setState({ playTimeoutRef: null, playDelayTimeoutRef: null });

  if (index < 0) index = 0;
  if (index >= data.length) {
    index = data.length - 1;
  }

  useReplayStore.setState({ currentIndex: index });
  const newPlayDelayTimeoutRef = setTimeout(() => {
    onPlayReplay();
  }, 300);
  useReplayStore.setState({ playDelayTimeoutRef: newPlayDelayTimeoutRef });
}
