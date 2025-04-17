
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Simple vocabulary items with placeholder URLs
const vocabularyItems = [
  { word: "apple", imageUrl: "https://placehold.co/300x300/red/white?text=Apple" },
  { word: "banana", imageUrl: "https://placehold.co/300x300/yellow/black?text=Banana" },
  { word: "cat", imageUrl: "https://placehold.co/300x300/gray/white?text=Cat" },
  { word: "dog", imageUrl: "https://placehold.co/300x300/brown/white?text=Dog" },
  { word: "elephant", imageUrl: "https://placehold.co/300x300/gray/white?text=Elephant" },
  { word: "fish", imageUrl: "https://placehold.co/300x300/blue/white?text=Fish" },
  { word: "giraffe", imageUrl: "https://placehold.co/300x300/yellow/black?text=Giraffe" },
  { word: "house", imageUrl: "https://placehold.co/300x300/brown/white?text=House" },
  { word: "ice cream", imageUrl: "https://placehold.co/300x300/pink/black?text=Ice+cream" },
  { word: "juice", imageUrl: "https://placehold.co/300x300/orange/black?text=Juice" },
];

const EnglishVocabularyGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [timerEnabled] = useState(() => localStorage.getItem("timerEnabled") === "true");
  const [playerName] = useState(() => localStorage.getItem("playerName") || "Player");

  // Generate a vocabulary question
  const generateVocabularyQuestion = (): Question => {
    const randomIndex = Math.floor(Math.random() * vocabularyItems.length);
    const item = vocabularyItems[randomIndex];
    
    return {
      id: Date.now(),
      type: 'english-word',
      content: "",
      correctAnswer: item.word,
      imageUrl: item.imageUrl,
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
    setCurrentQuestion(generateVocabularyQuestion());
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
    setCurrentQuestion(generateVocabularyQuestion());
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
          {currentQuestion && currentQuestion.imageUrl && (
            <>
              <div className="text-center">
                <p className="text-xl mb-4">What is this?</p>
                <AspectRatio ratio={1 / 1} className="bg-slate-100 mb-4">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Guess what this is"
                    className="rounded-md object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              
              <div>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-xl text-center p-6 border-purple-200"
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

export default EnglishVocabularyGame;
