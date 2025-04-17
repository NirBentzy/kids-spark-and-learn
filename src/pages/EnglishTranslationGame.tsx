
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, HeartOff } from "lucide-react";
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";
import { useGameContext } from "@/contexts/GameContext";

// English-Hebrew word pairs
const translationItems = [
  { english: "apple", hebrew: "תפוח" },
  { english: "dog", hebrew: "כלב" },
  { english: "cat", hebrew: "חתול" },
  { english: "house", hebrew: "בית" },
  { english: "book", hebrew: "ספר" },
  { english: "table", hebrew: "שולחן" },
  { english: "chair", hebrew: "כיסא" },
  { english: "water", hebrew: "מים" },
  { english: "bread", hebrew: "לחם" },
  { english: "tree", hebrew: "עץ" },
];

const EnglishTranslationGame = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    incrementScore, 
    decrementHearts, 
    resetGame, 
    setCurrentQuestion,
    setTimeLeft,
    setGameOver
  } = useGameContext();
  const [userAnswer, setUserAnswer] = useState("");

  // Generate a translation question
  const generateTranslationQuestion = (): Question => {
    const randomIndex = Math.floor(Math.random() * translationItems.length);
    const item = translationItems[randomIndex];
    
    return {
      id: Date.now(),
      type: 'english-word',
      content: item.english,
      correctAnswer: item.hebrew,
    };
  };

  // Check the answer
  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = userAnswer === String(gameState.currentQuestion.correctAnswer);
    
    if (isCorrect) {
      incrementScore();
    } else {
      decrementHearts();
    }
    
    // Reset and generate new question
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateTranslationQuestion());
  };

  // Initialize the game
  useEffect(() => {
    resetGame();
    setCurrentQuestion(generateTranslationQuestion());
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
                <h2 className="text-4xl font-bold text-purple-700 mb-4">
                  {gameState.currentQuestion.content}
                </h2>
                <p className="text-xl">Translate this word to Hebrew</p>
              </div>
              
              <div>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="הקלד תרגום"
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

export default EnglishTranslationGame;
