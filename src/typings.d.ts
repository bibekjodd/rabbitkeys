type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  carImage: string;
  speed: number;
  topSpeed: number;
  role: string;
  createdAt: string;
  lastOnline: string;
};

type Paragraph = {
  id: string;
  text: string;
};

type PlayerState = {
  name: string;
  id: string;
  email: string;
  isFinished: boolean;
  lastSeen: string;
  position: number;
  accuracy: number;
  speed: number;
  topSpeed: number;
  duration: number;
  image: string | null;
  carImage: string;
};

type Track = {
  id: string;
  createdAt: string;
  creator: string;
  players: PlayerState[];
  paragraphId: string;
  nextParagraphId: string;
  isStarted: boolean;
  isFinished: boolean;
  startedAt: string | null;
  finishedAt: string | null;
};

type Leaderboard = {
  speed: number;
  createdAt: string;
  topSpeed: number;
  accuracy: number;
  user: User;
}[];

type Result = {
  id: string;
  userId: string;
  position: number;
  speed: number;
  topSpeed: number;
  accuracy: number;
  isMultiplayer: boolean;
  createdAt: string;
};
