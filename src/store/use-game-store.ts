import {
  canStartAfterDelay,
  clearGameTimeout,
  scrollIntoView,
  stopGameOnMaxTimeout,
  updateSpeed,
  updateTimeline,
  wait
} from '@/lib/utils';
import { create } from 'zustand';
import { useLiveScore } from './use-live-score';
import { stopReplay, useReplayStore } from './use-replay-store';
import { clearTypingStore, useTypingStore } from './use-typing-store';

type Invitation = { message: string; trackId: string };
type State = {
  trackId: string | null;
  isMultiplayer: boolean;
  carImage: string | null;
  isModeDetermined: boolean;
  countdown: number;
  isReady: boolean;
  isStarted: boolean;
  isFinished: boolean;
  isMultiplayerFinished: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  invitation: Invitation | null;
  canStart: boolean;
  canStartTimeoutRef: NodeJS.Timeout | null;
  maxTimeoutRef: NodeJS.Timeout | null;
};

export const useGameStore = create<State>(() => ({
  trackId: null,
  isMultiplayer: false,
  carImage: null,
  isModeDetermined: false,
  isReady: false,
  isStarted: false,
  isFinished: false,
  countdown: 3,
  startedAt: null,
  finishedAt: null,
  invitation: null,
  canStart: true,
  canStartTimeoutRef: null,
  maxTimeoutRef: null,
  isMultiplayerFinished: false
}));

export async function startGame() {
  // update game store
  const { isReady, isStarted } = useGameStore.getState();
  useLiveScore.getState().clear();
  stopReplay();
  if (isReady || isStarted) {
    useGameStore.setState({ isFinished: false });
    return;
  }
  if (!isReady && !isStarted) {
    clearGame();
  }
  document.getElementById('close-invite-dialog')?.click();
  scrollIntoView('body');

  useGameStore.setState({
    isReady: true,
    isStarted: false,
    countdown: 3,
    isFinished: false
  });
  await wait(1000);
  useGameStore.setState({ countdown: 2 });
  await wait(1000);
  useGameStore.setState({ countdown: 1 });
  await wait(1000);
  useGameStore.setState({ countdown: 0 });
  await wait(500);

  useGameStore.setState({
    isReady: false,
    isStarted: true,
    isFinished: false,
    countdown: 0,
    startedAt: new Date().toISOString()
  });
  stopGameOnMaxTimeout();

  // update typing store
  const { paragraph } = useTypingStore.getState();
  clearTypingStore();
  if (paragraph) {
    useTypingStore.setState({ paragraph: { ...paragraph } });
  }
  const updateSpeedIntervalRef = setInterval(updateSpeed, 300);
  const updateTimelineIntervalRef = setInterval(updateTimeline, 1000);
  useTypingStore.setState({ updateSpeedIntervalRef, updateTimelineIntervalRef });

  // update replay store
  useReplayStore.setState({ isReplayAvailable: false, data: [] });

  await wait(100);
  const inputElement = document.getElementById('paragraph-input');
  inputElement?.focus();
  scrollIntoView('body');
}

type SwitchModeOptions =
  | { isMultiplayer: true; trackId: string }
  | { isMultiplayer: false; trackId?: undefined };
export function switchMode(options: SwitchModeOptions) {
  clearGame();
  stopReplay();
  if (options?.isMultiplayer && options?.trackId) {
    useGameStore.setState({
      isMultiplayer: true,
      trackId: options.trackId,
      isModeDetermined: true,
      canStart: false
    });
    canStartAfterDelay();
  } else {
    useGameStore.setState({
      isMultiplayer: false,
      trackId: null,
      isModeDetermined: true,
      canStart: true
    });
  }
}

export function updateCarImage(carImage: string) {
  useGameStore.setState({ carImage });
}

export function endGame() {
  const { isMultiplayer } = useGameStore.getState();
  useGameStore.setState({
    isReady: false,
    isStarted: false,
    isFinished: true,
    finishedAt: new Date().toISOString(),
    canStart: !isMultiplayer
  });
  clearGameTimeout();

  // update typing store
  updateSpeed();
  updateTimeline();
  const { updateSpeedIntervalRef, updateTimelineIntervalRef } = useTypingStore.getState();
  if (updateSpeedIntervalRef) clearInterval(updateSpeedIntervalRef);
  if (updateTimelineIntervalRef) clearInterval(updateTimelineIntervalRef);
  useTypingStore.setState({
    updateSpeedIntervalRef: null,
    updateTimelineIntervalRef: null,
    typedText: '',
    isTypedIncorrect: false
  });

  stopReplay();
}

export function clearGame() {
  useGameStore.setState({
    isReady: false,
    isStarted: false,
    isFinished: false,
    countdown: 3,
    startedAt: null,
    finishedAt: null,
    isMultiplayerFinished: false
  });
  clearGameTimeout();

  // clear typing store
  clearTypingStore();

  stopReplay();
}

export function updateInvitation(invitation: Invitation | null) {
  const { isStarted, isReady } = useGameStore.getState();
  if (isStarted || isReady) {
    invitation = null;
  }
  useGameStore.setState({ invitation });
}
