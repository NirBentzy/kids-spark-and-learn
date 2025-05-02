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
    
    // Filter by game, then get unique entries by name (keeping only the highest score)
    const gameEntries = allEntries.filter(entry => entry.game === game);
    
    // Group by name and keep only the highest score for each name
    const uniqueEntries: LeaderboardEntry[] = [];
    const processedNames = new Set<string>();
    
    for (const entry of gameEntries) {
      if (processedNames.has(entry.name)) continue;
      
      // Get all entries for this name
      const nameEntries = gameEntries.filter(e => e.name === entry.name);
      // Find the entry with the highest score
      const highestEntry = nameEntries.reduce((prev, current) => 
        (current.points > prev.points) ? current : prev, nameEntries[0]);
      
      uniqueEntries.push(highestEntry);
      processedNames.add(entry.name);
    }
    
    return uniqueEntries
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
    // Always use the real player name from localStorage if available
    const storedPlayerName = localStorage.getItem('playerName');
    const playerName = storedPlayerName && storedPlayerName.trim() !== '' 
      ? storedPlayerName 
      : name.trim();
    
    if (!playerName || playerName === '') return false;
    
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    
    const newEntry: LeaderboardEntry = {
      name: playerName,
      game,
      points,
      level,
      date: formattedDate
    };
    
    // Get existing entries
    let allEntries = getAllLeaderboardEntries();
    
    // Add the new entry
    allEntries.push(newEntry);
    
    // Save back to localStorage to ensure persistence
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
