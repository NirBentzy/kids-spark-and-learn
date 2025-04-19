import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Question } from "@/types";
import { useGameContext } from "@/contexts/GameContext";
import GameHeader from "@/components/GameHeader";
import GameOver from "@/components/GameOver";

const EnglishLetterGame = () => {
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

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    let isCorrect = false;

    if (gameState.currentQuestion.content.toLowerCase() === 'h') {
        isCorrect = userAnswer.toLowerCase() === 'i';
    } else {
        isCorrect = userAnswer.toLowerCase() === String(gameState.currentQuestion.correctAnswer).toLowerCase();
    }
    
    if (isCorrect) {
      incrementScore();
      setUserAnswer("");
      setTimeLeft(20);
      setCurrentQuestion(generateLetterQuestion());
    } else {
      decrementHearts();
      if (gameState.hearts > 0) {
        setUserAnswer("");
      }
    }
  };

  const handleTimeUp = () => {
    setGameOver(true);
  };

  const initializeGame = () => {
    resetGame();
    setCurrentQuestion(generateLetterQuestion());
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (gameState.gameOver) {
    return (
      <GameOver 
        playerName={gameState.playerName}
        score={gameState.score}
        onRestart={initializeGame}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-purple-200">
        <GameHeader
          playerName={gameState.playerName}
          score={gameState.score}
          hearts={gameState.hearts}
          timeLeft={gameState.timeLeft}
          timerEnabled={gameState.timerEnabled}
          gameOver={gameState.gameOver}
          onTimeUp={handleTimeUp}
        />
        <CardContent className="space-y-6">
          {gameState.currentQuestion && gameState.currentQuestion.options && (
            <>
              <div className="text-center p-6">
                <h2 className="text-5xl font-bold text-purple-700 mb-4">
                  {gameState.currentQuestion.content}
                </h2>
                <p className="text-xl">
                  What letter comes {gameState.currentQuestion.options[0]} this letter?
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
