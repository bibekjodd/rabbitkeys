import { create } from 'zustand';

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

export const useLiveScore = create<State & Actions>((set, get) => ({
  scores: [],
  updateScore(newScore) {
    const oldScores = [...get().scores];
    let updatedScores = oldScores.filter((score) => score.playerId !== newScore.playerId);
    updatedScores.push(newScore);
    set({ scores: [...updatedScores] });
  },
  clear() {
    set({ scores: [] });
  }
}));
