import { updateSpeed } from '@/lib/utils';
import { createStore } from '@jodd/snap';
import { endGame, useGameStore } from './use-game-store';
import { useLiveScore } from './use-live-score';
import { updateReplaySnapshot, useReplayStore } from './use-replay-store';

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
}

export const useTypingStore = createStore<TypingStore>(() => ({
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
  updateTimelineIntervalRef: null

  //
}));

export function loadParagraph(paragraph: Paragraph) {
  if (paragraph.id === useTypingStore.getState().paragraph?.id) return;
  useTypingStore.setState({
    paragraph: { ...paragraph },
    typedText: '',
    isTypedIncorrect: false,
    progress: 0
  });
}

export function onParagraphInput(letter: string) {
  let { typedText, errorsCount, totalErrorsCount } = useTypingStore.getState();
  let { isFinished } = useGameStore.getState();
  const { paragraph } = useTypingStore.getState();
  const { isReady, isStarted } = useGameStore.getState();
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
  useTypingStore.setState({
    progress,
    typedText,
    isTypedIncorrect,
    errorsCount,
    totalErrorsCount,
    accuracy
  });
  useGameStore.setState({ isFinished });
  updateReplaySnapshot({
    duration,
    isTypedIncorrect,
    index: typedText.length - 1,
    speed: useTypingStore.getState().speed,
    accuracy,
    typed: letter,
    letter: paragraph.text[letterIndex]
  });

  if (isFinished) {
    useReplayStore.setState({
      isReplayAvailable: !useGameStore.getState().isMultiplayer,
      currentIndex: 0,
      paragraph
    });
    useTypingStore.setState({ previousParagraph: paragraph });
    endGame();
  }
  const { speed } = useTypingStore.getState();
  useLiveScore.getState().updateScore({ playerId: '', progress, speed });
  return isFinished;
}

export function invalidateParagraph() {
  useTypingStore.setState({ paragraph: null, typedText: '', progress: 0 });
}

export function clearTypingStore() {
  const { updateSpeedIntervalRef, updateTimelineIntervalRef } = useTypingStore.getState();
  if (updateSpeedIntervalRef) clearInterval(updateSpeedIntervalRef);
  if (updateTimelineIntervalRef) clearInterval(updateTimelineIntervalRef);

  useTypingStore.setState({
    ...useTypingStore.getInitialState(),
    paragraph: useTypingStore.getState().paragraph,
    previousParagraph: useTypingStore.getState().previousParagraph
  });
}
