import NBAWrapper from '../../services/NBAWrapper';

const nba = new NBAWrapper();

// Function to fetch player team
export const fetchPlayerTeam = async (playerName) => {
  try {
    const response = await fetch(`/api/player-team?playerName=${encodeURIComponent(playerName)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch player team');
    }

    const data = await response.json();
    return data.teamName;
  } catch (error) {
    console.error('Error fetching player team:', error);
    throw error;
  }
};

// Function to fetch player game logs
export const fetchPlayerGameLogs = async (playerName, selectedStat, numGames) => {
  try {
    const queryParams = new URLSearchParams({
      playerName,
      selectedStat,
      numGames: numGames.toString()
    });

    const response = await fetch(`/api/player-game-logs?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch player game logs');
    }

    const data = await response.json();
    return data.gameLogs;
  } catch (error) {
    console.error('Error fetching player game logs:', error);
    throw error;
  }
};