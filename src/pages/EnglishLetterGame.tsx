
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";

const EnglishLetterGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [timerEnabled] = useState(() => localStorage.getItem("timerEnabled") === "true");
  const [playerName] = useState(() => localStorage.getItem("playerName") || "Player");

  // Generate a letter question
  const generateLetterQuestion = (): Question => {
    // Generate a random letter (A-Z) with random case
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomIndex = Math.floor(Math.random() * letters.length);
    const letter = letters[randomIndex];
    
    // Randomly determine if we're asking for the letter before or after
    const isLetterBefore = Math.random() > 0.5;
    const questionType = isLetterBefore ? "before" : "after";
    
    // Calculate the correct answer
    let correctAnswer;
    const letterCode = letter.charCodeAt(0);
    
    if (isLetterBefore) {
      // Handle edge cases for A and a
      if (letter === 'A') correctAnswer = 'Z';
      else if (letter === 'a') correctAnswer = 'z';
      else correctAnswer = String.fromCharCode(letterCode - 1);
    } else {
      // Handle edge cases for Z and z
      if (letter === 'Z') correctAnswer = 'A';
      else if (letter === 'z') correctAnswer = 'a';
      else correctAnswer = String.fromCharCode(letterCode + 1);
    }
    
    return {
      id: Date.now(),
      type: 'english-letter',
      content: letter,
      correctAnswer,
      options: [questionType], // Using options field to store the question type
    };
  };

  // Check the answer
  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = userAnswer.toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Reset and generate new question
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateLetterQuestion());
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
    setCurrentQuestion(generateLetterQuestion());
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
              onClick={() => navigate("/english")}
              className="flex-1 border-purple-300"
            >
              Choose Activity
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
          {currentQuestion && currentQuestion.options && (
            <>
              <div className="text-center p-6">
                <h2 className="text-5xl font-bold text-purple-700 mb-4">
                  {currentQuestion.content}
                </h2>
                <p className="text-xl">
                  What letter comes {currentQuestion.options[0]} this letter?
                </p>
              </div>
              
              <div>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={e => {
                    // Only allow a single letter
                    if (e.target.value.length <= 1) {
                      setUserAnswer(e.target.value);
                    }
                  }}
                  placeholder="Enter one letter"
                  className="text-3xl text-center p-6 border-purple-200"
                  autoFocus
                  maxLength={1}
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
            onClick={() => navigate("/english")}
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

export default EnglishLetterGame;
