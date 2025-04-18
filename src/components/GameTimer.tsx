
import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/contexts/GameContext";

interface GameTimerProps {
  timeLeft: number;
  maxTime: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft, maxTime, isRunning, onTimeUp }) => {
  const { decrementTimeLeft } = useGameContext();
  
  useEffect(() => {
    let timerId: number;
    
    if (isRunning && timeLeft > 0) {
      timerId = window.setInterval(() => {
        decrementTimeLeft();
        if (timeLeft <= 1) {
          onTimeUp();
        }
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timeLeft, isRunning, onTimeUp, decrementTimeLeft]);
  
  const percentage = (timeLeft / maxTime) * 100;
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-sm">
        <span>Time Left</span>
        <span>{timeLeft} seconds</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default GameTimer;
