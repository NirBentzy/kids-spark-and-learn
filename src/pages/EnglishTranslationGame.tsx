
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [showError, setShowError] = useState(false);
  const [nextQuestionReady, setNextQuestionReady] = useState<{ fn: () => void } | null>(null);
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
      // If we've used all words in this level, move to next level or reset if at max level
      if (currentLevel < 3) {
        setCurrentLevel(prev => prev + 1);
        setUsedWordIndices([]);
      } else {
        setGameOver(true);
        return null;
      }
    }
    
    let availableIndices = levelWords.map((_, index) => index)
      .filter(index => !usedWordIndices.includes(index));
    
    if (availableIndices.length === 0) {
      setGameOver(true);
      return null;
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
      setUserAnswer("");
      setTimeLeft(20);
      const newQuestion = generateTranslationQuestion();
      if (newQuestion) {
        setCurrentQuestion(newQuestion);
      }
    } else {
      decrementHearts();
      setShowError(true);
      // Store the next question function to be executed only when the user clicks "Continue"
      const prepareNextQuestion = () => {
        setUserAnswer("");
        setTimeLeft(20);
        const newQuestion = generateTranslationQuestion();
        if (newQuestion) {
          setCurrentQuestion(newQuestion);
        }
        setShowError(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      };
      
      setNextQuestionReady({ fn: prepareNextQuestion });
    }
    
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleContinueAfterError = () => {
    if (nextQuestionReady) {
      nextQuestionReady.fn();
      setNextQuestionReady(null);
    }
  };

  useEffect(() => {
    resetGame();
    setUsedWordIndices([]);
    setCurrentQuestion(generateTranslationQuestion());
  }, []);

  const handleRestart = () => {
    resetGame();
    setUsedWordIndices([]);
    setCurrentLevel(1);
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

      <Dialog open={showError} onOpenChange={(open) => {
        // Only allow the dialog to be closed via the Continue button
        if (!open && nextQuestionReady) {
          handleContinueAfterError();
        }
      }}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-500">Incorrect Answer</DialogTitle>
            <DialogDescription className="text-center pt-4">
              <p className="text-lg mb-2">The correct translation for</p>
              <p className="text-2xl font-bold text-purple-700 mb-2">
                {gameState.currentQuestion?.content}
              </p>
              <p className="text-lg mb-2">is</p>
              <p className="text-2xl font-bold text-purple-700 mb-4 direction-rtl">
                {gameState.currentQuestion?.correctAnswer}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={handleContinueAfterError}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnglishTranslationGame;
