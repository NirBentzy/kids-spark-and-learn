
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGameContext } from "@/contexts/GameContext";
import { generateVocabularyQuestion } from "@/utils/vocabularyUtils";
import GameOver from "@/components/GameOver";
import GameHeader from "@/components/GameHeader";
import { ConfettiEffect } from '@/components/ConfettiEffect';

const EnglishVocabularyGame = () => {
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = userAnswer.toLowerCase() === String(gameState.currentQuestion.correctAnswer).toLowerCase();
    
    if (isCorrect) {
      incrementScore();
      setShowConfetti(false);
      setTimeout(() => setShowConfetti(true), 0);
      setTimeout(() => setShowConfetti(false), 2500);
      
      setUserAnswer("");
      setTimeLeft(20);
      setCurrentQuestion(generateVocabularyQuestion());
      // Focus the input after state updates
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      decrementHearts();
      setShowCorrectAnswer(true);
    }
  };

  const handleContinue = () => {
    setShowCorrectAnswer(false);
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateVocabularyQuestion());
    // Focus the input after continuing
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRestart = () => {
    resetGame();
    setCurrentQuestion(generateVocabularyQuestion());
  };

  useEffect(() => {
    resetGame();
    setCurrentQuestion(generateVocabularyQuestion());
  }, []);

  if (gameState.gameOver) {
    return (
      <GameOver 
        playerName={gameState.playerName}
        score={gameState.score}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-2">
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
        </CardHeader>
        <CardContent className="space-y-6">
          {gameState.currentQuestion && (
            <>
              <div className="text-center p-6">
                <div className="flex justify-center mb-6">
                  {gameState.currentQuestion.imageUrl ? (
                    <img 
                      src={gameState.currentQuestion.imageUrl}
                      alt="What's this?"
                      className="w-32 h-32 object-contain"
                    />
                  ) : null}
                </div>
                <p className="text-xl">Type the word in English</p>
                {showCorrectAnswer && (
                  <div className="mt-4">
                    <p className="text-red-500 mb-2">Incorrect! The correct word was:</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {gameState.currentQuestion.content}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <Input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-xl text-center p-6 border-purple-200"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !showCorrectAnswer && userAnswer) {
                      checkAnswer();
                    }
                    if (e.key === 'Enter' && showCorrectAnswer) {
                      handleContinue();
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
          {showCorrectAnswer ? (
            <Button 
              onClick={handleContinue}
              className="bg-purple-600 hover:bg-purple-700 px-8"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="bg-purple-600 hover:bg-purple-700 px-8"
            >
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnglishVocabularyGame;
