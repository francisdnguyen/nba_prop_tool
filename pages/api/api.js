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

// Function to fetch all NBA players for autocomplete
export const fetchAllPlayers = async () => {
  try {
    const response = await fetch('/api/getPlayerInfo');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch players');
    }

    const data = await response.json();
    const players = data.resultSets[0];
    
    // Extract player names from the response
    const headers = players.headers;
    const playerNameIndex = headers.indexOf('DISPLAY_FIRST_LAST');
    
    if (playerNameIndex === -1) {
      throw new Error('Player name field not found in response');
    }

    // Get all player names and sort them alphabetically
    const playerNames = players.rowSet
      .map(player => player[playerNameIndex])
      .sort((a, b) => a.localeCompare(b));

    return playerNames;
  } catch (error) {
    console.error('Error fetching all players:', error);
    // Return a fallback list of popular players if API fails
    return [
      'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
      'Luka Doncic', 'Jayson Tatum', 'Joel Embiid', 'Nikola Jokic',
      'Damian Lillard', 'Jimmy Butler', 'Kawhi Leonard', 'Paul George',
      'Anthony Davis', 'Devin Booker', 'Donovan Mitchell', 'Trae Young',
      'Ja Morant', 'Zion Williamson', 'Anthony Edwards', 'Tyrese Haliburton'
    ];
  }
};