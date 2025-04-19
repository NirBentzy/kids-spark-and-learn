
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, HeartOff } from "lucide-react";
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";
import { useGameContext } from "@/contexts/GameContext";
import { ConfettiEffect } from '@/components/ConfettiEffect';

const MathGame = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    incrementScore, 
    decrementHearts, 
    resetGame,
    setCurrentQuestion,
    setTimeLeft,
    decrementTimeLeft,
    setGameOver
  } = useGameContext();
  const [userAnswer, setUserAnswer] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate a math question
  const generateMathQuestion = (): Question => {
    // Generate numbers from 0 to 12
    const num1 = Math.floor(Math.random() * 13);
    const num2 = Math.floor(Math.random() * 13);
    
    // Sometimes add a third number for more challenge
    const hasThirdNumber = Math.random() > 0.7;
    const num3 = hasThirdNumber ? Math.floor(Math.random() * 13) : null;
    
    let content, correctAnswer;
    
    if (hasThirdNumber && num3 !== null) {
      content = `${num1} × ${num2} × ${num3}`;
      correctAnswer = num1 * num2 * num3;
    } else {
      content = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
    }
    
    return {
      id: Date.now(),
      type: 'math',
      content,
      correctAnswer,
    };
  };

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = Number(userAnswer) === Number(gameState.currentQuestion.correctAnswer);
    
    if (isCorrect) {
      incrementScore();
      // Immediately show confetti
      setShowConfetti(false); // Reset first to ensure re-render
      setTimeout(() => setShowConfetti(true), 0);
      setTimeout(() => setShowConfetti(false), 2500);
      
      setUserAnswer("");
      setTimeLeft(20);
      setCurrentQuestion(generateMathQuestion());
    } else {
      decrementHearts();
    }
  };

  useEffect(() => {
    resetGame();
    setCurrentQuestion(generateMathQuestion());
  }, []);

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-700">
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-4">Good job, {gameState.playerName}!</p>
            <p className="text-3xl font-bold mb-6">Your Score: {gameState.score}</p>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              onClick={resetGame}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Play Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/subjects")}
              className="flex-1 border-purple-300"
            >
              Choose Subject
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-2">
      {showConfetti && <ConfettiEffect />}
      <Card className="w-full max-w-md shadow-lg border-purple-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Player: {gameState.playerName}</p>
                <p className="text-lg font-bold">Score: {gameState.score}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: gameState.hearts }).map((_, i) => (
                  <Heart key={`heart-${i}`} className="text-red-500" size={24} />
                ))}
                {Array.from({ length: 3 - gameState.hearts }).map((_, i) => (
                  <HeartOff key={`heart-off-${i}`} className="text-gray-300" size={24} />
                ))}
              </div>
            </div>
            {gameState.timerEnabled && (
              <GameTimer
                timeLeft={gameState.timeLeft}
                maxTime={20}
                isRunning={!gameState.gameOver}
                onTimeUp={() => setGameOver(true)}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameState.currentQuestion && (
            <>
              <div className="text-center p-6">
                <h2 className="text-4xl font-bold text-purple-700">
                  {gameState.currentQuestion.content} = ?
                </h2>
              </div>
              
              <div>
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-2xl text-center p-6 border-purple-200"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      checkAnswer();
                    }
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate("/subjects")}
            className="border-purple-300"
          >
            Exit Game
          </Button>
          <Button 
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="bg-purple-600 hover:bg-purple-700 px-8"
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MathGame;
