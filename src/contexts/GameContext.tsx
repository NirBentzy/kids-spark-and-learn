
import React, { createContext, useContext, useState } from "react";
import { GameState, Question } from "../types";

interface GameContextType {
  gameState: GameState;
  setPlayerName: (name: string) => void;
  setTimerEnabled: (enabled: boolean) => void;
  setCurrentQuestion: (question: Question) => void;
  incrementScore: () => void;
  resetScore: () => void;
  setTimeLeft: (time: number) => void;
  decrementTimeLeft: () => void;
  setGameOver: (over: boolean) => void;
  resetGame: () => void;
}

const defaultGameState: GameState = {
  playerName: "",
  score: 0,
  timerEnabled: true,
  currentQuestion: null,
  timeLeft: 20,
  gameOver: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize from localStorage if available
    const storedName = localStorage.getItem("playerName") || "";
    const storedTimer = localStorage.getItem("timerEnabled") === "true";
    
    return {
      ...defaultGameState,
      playerName: storedName,
      timerEnabled: storedTimer,
    };
  });

  const setPlayerName = (name: string) => {
    setGameState((prev) => ({ ...prev, playerName: name }));
  };

  const setTimerEnabled = (enabled: boolean) => {
    setGameState((prev) => ({ ...prev, timerEnabled: enabled }));
  };

  const setCurrentQuestion = (question: Question) => {
    setGameState((prev) => ({ ...prev, currentQuestion: question }));
  };

  const incrementScore = () => {
    setGameState((prev) => ({ ...prev, score: prev.score + 1 }));
  };

  const resetScore = () => {
    setGameState((prev) => ({ ...prev, score: 0 }));
  };

  const setTimeLeft = (time: number) => {
    setGameState((prev) => ({ ...prev, timeLeft: time }));
  };

  const decrementTimeLeft = () => {
    setGameState((prev) => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) }));
  };

  const setGameOver = (over: boolean) => {
    setGameState((prev) => ({ ...prev, gameOver: over }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      score: 0,
      currentQuestion: null,
      timeLeft: 20,
      gameOver: false,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPlayerName,
        setTimerEnabled,
        setCurrentQuestion,
        incrementScore,
        resetScore,
        setTimeLeft,
        decrementTimeLeft,
        setGameOver,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
