
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addLeaderboardEntry, doesScoreQualify } from "@/utils/leaderboardUtils";
import { useEffect, useState } from "react";

interface GameOverProps {
  playerName: string;
  score: number;
  onRestart: () => void;
  gameType: 'math' | 'english-letters' | 'english-vocabulary' | 'english-translation';
  level?: number;
}

const GameOver = ({ playerName, score, onRestart, gameType, level }: GameOverProps) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [savedToLeaderboard, setSavedToLeaderboard] = useState(false);

  useEffect(() => {
    // Format date as DD/MM/YY
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2);
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Add score to leaderboard if it qualifies
    if (doesScoreQualify(gameType, score) && playerName && score > 0) {
      const wasAdded = addLeaderboardEntry(playerName, gameType, score, level);
      setSavedToLeaderboard(wasAdded);
    }
  }, [playerName, score, gameType, level]);

  // Determine which route to navigate back to
  const getBackRoute = () => {
    if (gameType === "math") return "/subjects";
    return "/english";
  };

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
          <p className="text-3xl font-bold mb-2">Your Score: {score}</p>
          <p className="text-sm text-gray-500 mb-6">{currentDate}</p>
          
          {savedToLeaderboard && (
            <div className="bg-yellow-100 border border-yellow-200 rounded-md p-3 mb-6">
              <p className="text-yellow-700 flex items-center justify-center gap-2">
                <span className="text-lg">👑</span>
                Your score made it to the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button 
            onClick={onRestart}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Play Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(getBackRoute())}
            className="flex-1 border-purple-300"
          >
            Choose Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOver;
