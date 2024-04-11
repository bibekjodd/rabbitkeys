import { updateSpeed, updateTimeline } from '@/lib/utils';
import { create } from 'zustand';
import { useGameStore } from './useGameStore';
import { useLiveScore } from './useLiveScore';
import { useReplayStore } from './useReplayStore';

export type TimelineData = {
  duration: number;
  speed: number;
  errorsCount: number;
  progress: number;
  accuracy: number;
};
interface TypingStore {
  paragraph: Paragraph | null;
  previousParagraph: Paragraph | null;
  typedText: string;
  isTypedIncorrect: boolean;
  progress: number;
  speed: number;
  topSpeed: number;
  duration: number;
  errorsCount: number;
  totalErrorsCount: number;
  accuracy: number;
  timeline: TimelineData[];

  updateSpeedIntervalRef: NodeJS.Timeout | null;
  updateTimelineIntervalRef: NodeJS.Timeout | null;

  onParagraphInput: (letter: string) => boolean;
  loadParagraph: (paragraph: Paragraph) => void;
  invalidateParagraph: () => void;

  onStart: () => void;
  onEnd: () => void;
  onClear: () => void;
}

export const useTypingStore = create<TypingStore>((set, get) => ({
  paragraph: null,
  previousParagraph: null,
  typedText: '',
  isTypedIncorrect: false,
  progress: 0,
  speed: 0,
  topSpeed: 0,
  duration: 0,
  errorsCount: 0,
  totalErrorsCount: 0,
  accuracy: 100,
  timeline: [],

  replayTimeoutRef: null,
  updateSpeedIntervalRef: null,
  updateTimelineIntervalRef: null,

  loadParagraph(paragraph) {
    if (paragraph.id === get().paragraph?.id) return;
    set({ paragraph: { ...paragraph }, typedText: '', isTypedIncorrect: false, progress: 0 });
  },

  onParagraphInput(letter) {
    let { typedText, paragraph, errorsCount, totalErrorsCount } = get();
    let { isFinished, isReady, isStarted } = useGameStore.getState();
    if (isFinished) return true;
    if (isReady || !isStarted || !paragraph) return false;

    const paragraphLength = Number(paragraph.text.length) || 1;
    const letterIndex = typedText.length;
    const isTypedIncorrect = paragraph?.text[letterIndex] !== letter;
    typedText = isTypedIncorrect ? typedText : typedText + letter;
    isFinished = typedText === paragraph?.text;
    const progress = 100 * (typedText.length / paragraphLength);
    if (isTypedIncorrect) {
      errorsCount++;
      totalErrorsCount++;
    }

    let accuracy = (typedText.length * 100) / (typedText.length + totalErrorsCount);
    accuracy = Math.round(Number(accuracy)) || 100;
    const duration = Date.now() - new Date(useGameStore.getState().startedAt!).getTime();

    updateSpeed();
    set({ progress, typedText, isTypedIncorrect, errorsCount, totalErrorsCount, accuracy });
    useGameStore.setState({ isFinished });
    useReplayStore.getState().updateSnapshot({
      duration,
      isTypedIncorrect,
      index: typedText.length - 1,
      speed: get().speed,
      accuracy,
      typed: letter,
      letter: paragraph.text[letterIndex]
    });

    if (isFinished) {
      useGameStore.getState().endGame();
      useReplayStore.getState().onTypingComplete(paragraph);
      set({ previousParagraph: paragraph });
    }
    const { speed } = get();
    useLiveScore.getState().updateScore({ playerId: '', progress, speed });
    return isFinished;
  },

  invalidateParagraph() {
    set({ paragraph: null, typedText: '', progress: 0 });
  },

  onStart() {
    const { onClear, paragraph } = get();
    onClear();
    if (paragraph) {
      set({ paragraph: { ...paragraph } });
    }
    const updateSpeedIntervalRef = setInterval(updateSpeed, 300);
    const updateTimelineIntervalRef = setInterval(updateTimeline, 1000);
    set({ updateSpeedIntervalRef, updateTimelineIntervalRef });
    useReplayStore.getState().onTypingStart();
  },

  onEnd() {
    updateSpeed();
    updateTimeline();
    const { updateSpeedIntervalRef, updateTimelineIntervalRef } = get();
    updateSpeedIntervalRef && clearInterval(updateSpeedIntervalRef);
    updateTimelineIntervalRef && clearInterval(updateTimelineIntervalRef);
    set({
      updateSpeedIntervalRef: null,
      updateTimelineIntervalRef: null,
      typedText: '',
      isTypedIncorrect: false
    });
  },

  onClear() {
    const { updateSpeedIntervalRef, updateTimelineIntervalRef } = get();
    updateSpeedIntervalRef && clearInterval(updateSpeedIntervalRef);
    updateTimelineIntervalRef && clearInterval(updateTimelineIntervalRef);
    set({
      updateSpeedIntervalRef: null,
      updateTimelineIntervalRef: null,
      typedText: '',
      isTypedIncorrect: false,
      speed: 0,
      topSpeed: 0,
      progress: 0,
      duration: 0,
      accuracy: 100,
      errorsCount: 0,
      totalErrorsCount: 0,
      timeline: []
    });
  }

  //
}));
