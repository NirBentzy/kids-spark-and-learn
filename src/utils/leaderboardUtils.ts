type Game = 'math' | 'english-letters' | 'english-vocabulary' | 'english-translation';

export interface LeaderboardEntry {
  name: string;
  game: Game;
  points: number;
  level?: number;
  date: string;
}

// Format date as DD/MM/YY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

// Get leaderboard entries for a specific game
export const getLeaderboard = (game: Game): LeaderboardEntry[] => {
  try {
    const leaderboardData = localStorage.getItem('gameLeaderboard');
    if (!leaderboardData) return [];
    
    const allEntries: LeaderboardEntry[] = JSON.parse(leaderboardData);
    return allEntries
      .filter(entry => entry.game === game)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
};

// Get all leaderboard entries
export const getAllLeaderboardEntries = (): LeaderboardEntry[] => {
  try {
    const leaderboardData = localStorage.getItem('gameLeaderboard');
    if (!leaderboardData) return [];
    return JSON.parse(leaderboardData);
  } catch (error) {
    console.error("Error getting all leaderboard entries:", error);
    return [];
  }
};

// Add a new entry to the leaderboard
export const addLeaderboardEntry = (
  name: string,
  game: Game,
  points: number,
  level?: number
): boolean => {
  try {
    if (!name || name.trim() === '') return false;
    
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    
    const newEntry: LeaderboardEntry = {
      name: name.trim(),
      game,
      points,
      level,
      date: formattedDate
    };
    
    // Get existing entries
    let allEntries = getAllLeaderboardEntries();
    
    // Add the new entry
    allEntries.push(newEntry);
    
    // Sort and limit to top entries per game
    const gameEntries = allEntries.filter(entry => entry.game === game);
    
    if (gameEntries.length > 10) {
      // Sort by points (highest first)
      const sortedGameEntries = gameEntries.sort((a, b) => b.points - a.points);
      
      // If new entry doesn't make the top 10, exit early
      const isTopTen = sortedGameEntries.slice(0, 10).some(entry => 
        entry.name === newEntry.name && entry.points === newEntry.points && entry.date === newEntry.date
      );
      
      if (!isTopTen) return false;
      
      // Keep only the top 10 for this game
      const topTenForGame = sortedGameEntries.slice(0, 10);
      
      // Replace all entries for this game with just the top 10
      allEntries = allEntries.filter(entry => entry.game !== game).concat(topTenForGame);
    }
    
    // Save back to localStorage
    localStorage.setItem('gameLeaderboard', JSON.stringify(allEntries));
    return true;
  } catch (error) {
    console.error("Error adding leaderboard entry:", error);
    return false;
  }
};

// Check if a score qualifies for the leaderboard
export const doesScoreQualify = (game: Game, points: number): boolean => {
  const leaderboard = getLeaderboard(game);
  
  // If there are less than 10 entries, any score qualifies
  if (leaderboard.length < 10) return true;
  
  // Check if the new score is higher than the lowest score
  const lowestScore = leaderboard[leaderboard.length - 1].points;
  return points > lowestScore;
};

// Get game display name
export const getGameDisplayName = (game: Game): string => {
  switch (game) {
    case 'math': return 'Mathematics';
    case 'english-letters': return 'English Letters';
    case 'english-vocabulary': return 'English Vocabulary';
    case 'english-translation': return 'English Translation';
    default: return 'Unknown Game';
  }
};
