import { createStore } from '@jodd/snap';

type Score = {
  playerId: string;
  speed: number;
  progress: number;
};
type State = {
  scores: Score[];
};
type Actions = {
  updateScore: (score: Score) => void;
  clear: () => void;
};

export const useLiveScore = createStore<State & Actions>((set, get) => ({
  scores: [],
  updateScore(newScore) {
    const oldScores = [...get().scores];
    const updatedScores = oldScores.filter((score) => score.playerId !== newScore.playerId);
    updatedScores.push(newScore);
    set({ scores: [...updatedScores] });
  },
  clear() {
    set({ scores: [] });
  }
}));
