import { canStartAfterDelay, clearGameTimeout, stopGameOnMaxTimeout, wait } from '@/lib/utils';
import { create } from 'zustand';
import { useLiveScore } from './useLiveScore';
import { useReplayStore } from './useReplayStore';
import { useTypingStore } from './useTypingStore';

type SwitchModeOptions =
  | { isMultiplayer: true; trackId: string }
  | { isMultiplayer: false; trackId?: undefined };

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

type Actions = {
  switchMode: (options?: SwitchModeOptions) => void;
  updateCarImage: (carImage: string) => void;
  startGame: () => Promise<void>;
  endGame: () => void;
  clearGame: () => void;
  updateInvitation: (invitation: Invitation | null) => void;
};

export const useGameStore = create<State & Actions>((set, get) => {
  return {
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
    isMultiplayerFinished: false,

    switchMode(options) {
      get().clearGame();
      useReplayStore.getState().stop();
      if (options?.isMultiplayer && options?.trackId) {
        set({
          isMultiplayer: true,
          trackId: options.trackId,
          isModeDetermined: true,
          canStart: false
        });
        canStartAfterDelay();
      } else {
        set({ isMultiplayer: false, trackId: null, isModeDetermined: true, canStart: true });
      }
    },

    updateCarImage(carImage) {
      set({ carImage });
    },

    async startGame() {
      const { isReady, isStarted, clearGame } = get();
      useLiveScore.getState().clear();
      useReplayStore.getState().stop();
      if (isReady || isStarted) {
        set({ isFinished: false });
        return;
      }
      if (!isReady && !isStarted) {
        clearGame();
      }
      document.getElementById('close-invite-dialog')?.click();
      window.scroll({ top: 0, behavior: 'smooth' });

      set({
        isReady: true,
        isStarted: false,
        countdown: 3,
        isFinished: false
      });
      await wait(1000);
      set({ countdown: 2 });
      await wait(1000);
      set({ countdown: 1 });
      await wait(1000);
      set({ countdown: 0 });
      await wait(500);

      set({
        isReady: false,
        isStarted: true,
        isFinished: false,
        countdown: 0,
        startedAt: new Date().toISOString()
      });
      stopGameOnMaxTimeout();
      useTypingStore.getState().onStart();
      await wait(100);
      const inputElement = document.getElementById('paragraph-input');
      inputElement?.focus();
      window.scroll({ top: 0, behavior: 'smooth' });
    },

    endGame() {
      const { isMultiplayer } = get();
      set({
        isReady: false,
        isStarted: false,
        isFinished: true,
        finishedAt: new Date().toISOString(),
        canStart: !isMultiplayer
      });
      clearGameTimeout();
      useTypingStore.getState().onEnd();
      useReplayStore.getState().stop();
    },

    clearGame() {
      set({
        isReady: false,
        isStarted: false,
        isFinished: false,
        countdown: 3,
        startedAt: null,
        finishedAt: null,
        isMultiplayerFinished: false
      });
      clearGameTimeout();
      useTypingStore.getState().onClear();
      useReplayStore.getState().stop();
    },

    updateInvitation(invitation) {
      const { isStarted, isReady } = get();
      if (isStarted || isReady) {
        invitation = null;
      }
      set({ invitation });
    }
  };
});
