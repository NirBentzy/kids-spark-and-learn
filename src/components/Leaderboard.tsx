
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LeaderboardEntry, getLeaderboard, getGameDisplayName } from "@/utils/leaderboardUtils";

interface LeaderboardProps {
  game: 'math' | 'english-letters' | 'english-vocabulary' | 'english-translation';
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard = ({ game, isOpen, onClose }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Fetch leaderboard when game changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setLeaderboard(getLeaderboard(game));
    }
  }, [game, isOpen]);
  
  // Medal components for top 3 positions
  const positionBadges = [
    <span key="1" className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-bold">1</span>,
    <span key="2" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white font-bold">2</span>,
    <span key="3" className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-bold">3</span>,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-2xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <span className="text-2xl">👑</span>
            {getGameDisplayName(game)} Leaderboard
          </DialogTitle>
          <Button 
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </DialogHeader>
        
        {leaderboard.length > 0 ? (
          <div className="max-h-[60vh] overflow-auto">
            <Table className="border rounded-lg">
              <TableHeader>
                <TableRow className="bg-purple-50">
                  <TableHead className="w-12 text-center">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow 
                    key={`${entry.name}-${entry.date}-${index}`}
                    className={index < 3 ? "bg-purple-50/50" : ""}
                  >
                    <TableCell className="text-center">
                      {index < 3 ? (
                        <div className="flex justify-center">{positionBadges[index]}</div>
                      ) : (
                        <span className="font-medium text-gray-600">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {index === 0 && <span className="mr-1">👑</span>}
                      {entry.name}
                    </TableCell>
                    <TableCell className="text-right font-bold">{entry.points}</TableCell>
                    <TableCell className="text-right text-gray-500">{entry.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-gray-500">No scores yet! Be the first to play.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
