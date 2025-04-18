import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, HeartOff } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoffee, faAppleWhole, faCat, faDog, faHouse,
  faPencil, faCrown, faFish, faBanana, faIceCream,
  faGlassWater, faChessKing, faOtter, faFeather,
  faCarrot, faPen, faChessQueen, faPaw, faWorm, faCat as faTiger
} from '@fortawesome/free-solid-svg-icons';
import GameTimer from "@/components/GameTimer";
import { Question } from "@/types";
import { useGameContext } from "@/contexts/GameContext";

// Vocabulary items with corresponding icons
const vocabularyItems = [
  { word: "apple", icon: faAppleWhole },
  { word: "banana", icon: faBanana },
  { word: "cat", icon: faCat },
  { word: "dog", icon: faDog },
  { word: "elephant", icon: faOtter }, // Using otter as placeholder
  { word: "fish", icon: faFish },
  { word: "giraffe", icon: faPaw }, // Using paw as placeholder
  { word: "house", icon: faHouse },
  { word: "ice cream", icon: faIceCream },
  { word: "juice", icon: faGlassWater },
  { word: "king", icon: faChessKing },
  { word: "lion", icon: faCat },
  { word: "monkey", icon: faPaw },
  { word: "nest", icon: faFeather },
  { word: "orange", icon: faAppleWhole },
  { word: "pencil", icon: faPencil },
  { word: "queen", icon: faChessQueen },
  { word: "rabbit", icon: faPaw },
  { word: "snake", icon: faWorm },
  { word: "tiger", icon: faTiger }
];

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

  // Generate a vocabulary question
  const generateVocabularyQuestion = (): Question => {
    const randomIndex = Math.floor(Math.random() * vocabularyItems.length);
    const item = vocabularyItems[randomIndex];
    
    return {
      id: Date.now(),
      type: 'english-word',
      content: item.word,
      correctAnswer: item.word,
    };
  };

  // Check the answer
  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = userAnswer.toLowerCase() === String(gameState.currentQuestion.correctAnswer).toLowerCase();
    
    if (isCorrect) {
      incrementScore();
      setUserAnswer("");
      setTimeLeft(20);
      setCurrentQuestion(generateVocabularyQuestion());
    } else {
      decrementHearts();
      setShowCorrectAnswer(true);
    }
  };

  // Continue to next question after showing correct answer
  const handleContinue = () => {
    setShowCorrectAnswer(false);
    setUserAnswer("");
    setTimeLeft(20);
    setCurrentQuestion(generateVocabularyQuestion());
  };

  // Initialize the game
  useEffect(() => {
    resetGame();
    setCurrentQuestion(generateVocabularyQuestion());
  }, []);

  // Get the current icon to display
  const getCurrentIcon = () => {
    if (!gameState.currentQuestion) return null;
    
    const currentWord = gameState.currentQuestion.content;
    const item = vocabularyItems.find(item => item.word === currentWord);
    
    if (!item) return null;
    
    return <FontAwesomeIcon icon={item.icon} size="6x" className="text-purple-600" />;
  };

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
                <div className="flex justify-center mb-6">
                  {getCurrentIcon()}
                </div>
                <p className="text-xl">Type the word in English</p>
                {showCorrectAnswer && (
                  <div className="mt-4">
                    <p className="text-red-500 mb-2">Incorrect! The correct word was:</p>
                    <p className="text-2xl font-bold text-purple-700">{gameState.currentQuestion.content}</p>
                  </div>
                )}
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
                    if (e.key === 'Enter' && !showCorrectAnswer) {
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
