
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Leaderboard from "./Leaderboard";

interface LeaderboardButtonProps {
  game: 'math' | 'english-letters' | 'english-vocabulary' | 'english-translation';
}

const LeaderboardButton = ({ game }: LeaderboardButtonProps) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full hover:bg-purple-100"
        onClick={() => setIsLeaderboardOpen(true)}
      >
        <Crown className="text-yellow-500" />
      </Button>

      <Leaderboard 
        game={game} 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
    </>
  );
};

export default LeaderboardButton;
