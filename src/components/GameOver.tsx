
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GameOverProps {
  playerName: string;
  score: number;
  onRestart: () => void;
}

const GameOver = ({ playerName, score, onRestart }: GameOverProps) => {
  const navigate = useNavigate();

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
            onClick={onRestart}
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
};

export default GameOver;
