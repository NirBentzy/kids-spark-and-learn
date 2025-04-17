
export interface Question {
  id: number;
  type: 'math' | 'english-letter' | 'english-word';
  content: string;
  options?: string[];
  correctAnswer: string | number;
  imageUrl?: string;
}

export interface GameState {
  playerName: string;
  score: number;
  timerEnabled: boolean;
  currentQuestion: Question | null;
  timeLeft: number;
  gameOver: boolean;
  hearts: number;  // Add hearts to track lives
}
