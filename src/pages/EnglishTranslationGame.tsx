
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGameContext } from "@/contexts/GameContext";
import { translationWords } from "@/data/translationLevels";
import { ConfettiEffect } from '@/components/ConfettiEffect';
import GameHeader from "@/components/GameHeader";
import GameOver from "@/components/GameOver";

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
  const [usedWordIndices, setUsedWordIndices] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate current level based on score
  useEffect(() => {
    const newLevel = Math.floor(gameState.score / 10) + 1;
    if (newLevel !== currentLevel && newLevel <= 3) {
      setCurrentLevel(newLevel);
    }
  }, [gameState.score]);

  const generateTranslationQuestion = () => {
    const levelWords = translationWords.filter(word => word.level === currentLevel);
    
    if (usedWordIndices.length >= levelWords.length) {
      setUsedWordIndices([]);
    }
    
    let availableIndices = levelWords.map((_, index) => index)
      .filter(index => !usedWordIndices.includes(index));
    
    if (availableIndices.length === 0) {
      setUsedWordIndices([]);
      availableIndices = levelWords.map((_, index) => index);
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedWordIndices(prev => [...prev, randomIndex]);
    
    const word = levelWords[randomIndex];
    
    return {
      id: Date.now(),
      type: "english-word" as const,
      content: word.english,
      correctAnswer: word.hebrew,
    };
  };

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = userAnswer === String(gameState.currentQuestion.correctAnswer);
    
    if (isCorrect) {
      incrementScore();
      setShowConfetti(false);
      setTimeout(() => setShowConfetti(true), 0);
    } else {
      decrementHearts();
    }
    
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateTranslationQuestion());
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    resetGame();
    setUsedWordIndices([]);
    setCurrentQuestion(generateTranslationQuestion());
  }, []);

  const handleRestart = () => {
    resetGame();
    setUsedWordIndices([]);
    setCurrentQuestion(generateTranslationQuestion());
  };

  if (gameState.gameOver) {
    return <GameOver playerName={gameState.playerName} score={gameState.score} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-purple-50 p-4">
      {showConfetti && <ConfettiEffect />}
      <Card className="w-full max-w-md shadow-lg border-purple-200">
        <CardHeader>
          <GameHeader 
            playerName={gameState.playerName}
            score={gameState.score}
            hearts={gameState.hearts}
            timeLeft={gameState.timeLeft}
            timerEnabled={gameState.timerEnabled}
            gameOver={gameState.gameOver}
            onTimeUp={() => setGameOver(true)}
          />
          <div className="text-sm text-purple-600 mt-2">
            Level {currentLevel}
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
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="הקלד תרגום"
                  className="text-xl text-center p-6 border-purple-200"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && userAnswer) {
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
