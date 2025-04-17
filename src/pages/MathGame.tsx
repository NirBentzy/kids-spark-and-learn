
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";

const MathGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [timerEnabled] = useState(() => localStorage.getItem("timerEnabled") === "true");
  const [playerName] = useState(() => localStorage.getItem("playerName") || "Player");

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

  // Check the answer
  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = Number(userAnswer) === Number(currentQuestion.correctAnswer);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Reset and generate new question
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateMathQuestion());
  };

  // Handle time up
  const handleTimeUp = () => {
    if (timerEnabled) {
      setGameOver(true);
    }
  };

  // Reset the game
  const resetGame = () => {
    setScore(0);
    setUserAnswer("");
    setTimeLeft(20);
    setGameOver(false);
    setCurrentQuestion(generateMathQuestion());
  };

  // Initialize the game
  useEffect(() => {
    resetGame();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!timerEnabled || gameOver || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerEnabled, gameOver, timeLeft]);

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-700">
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-4">Good job, {playerName}!</p>
            <p className="text-3xl font-bold mb-6">Your Score: {score}</p>
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
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-purple-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Player: {playerName}</p>
              <p className="text-lg font-bold">Score: {score}</p>
            </div>
            {timerEnabled && (
              <GameTimer
                timeLeft={timeLeft}
                maxTime={20}
                isRunning={!gameOver}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion && (
            <>
              <div className="text-center p-6">
                <h2 className="text-4xl font-bold text-purple-700">
                  {currentQuestion.content} = ?
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
