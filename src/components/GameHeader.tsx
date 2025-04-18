
import { Heart, HeartOff } from "lucide-react";
import GameTimer from "./GameTimer";

interface GameHeaderProps {
  playerName: string;
  score: number;
  hearts: number;
  timeLeft: number;
  timerEnabled: boolean;
  gameOver: boolean;
  onTimeUp: () => void;
}

const GameHeader = ({ 
  playerName, 
  score, 
  hearts, 
  timeLeft, 
  timerEnabled, 
  gameOver,
  onTimeUp 
}: GameHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Player: {playerName}</p>
          <p className="text-lg font-bold">Score: {score}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: hearts }).map((_, i) => (
            <Heart key={`heart-${i}`} className="text-red-500" size={24} />
          ))}
          {Array.from({ length: 3 - hearts }).map((_, i) => (
            <HeartOff key={`heart-off-${i}`} className="text-gray-300" size={24} />
          ))}
        </div>
      </div>
      {timerEnabled && (
        <GameTimer
          timeLeft={timeLeft}
          maxTime={20}
          isRunning={!gameOver}
          onTimeUp={onTimeUp}
        />
      )}
    </div>
  );
};

export default GameHeader;
