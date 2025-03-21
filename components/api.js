import axios from 'axios';

// Function to fetch player game logs
export const fetchPlayerGameLogs = async (playerName, lastNGames) => {
    try {
      // Step 1: Convert player name to player ID (using a backend or hardcoded mapping)
      const playerId = await getPlayerId(playerName);
  
      // Step 2: Fetch player game logs using the player ID
      const response = await axios.get(`${BASE_URL}/playergamelogs`, {
        params: {
          PlayerID: playerId,
          LastNGames: lastNGames,
          Season: '2022-23', // Look up how to get current yaer
          SeasonType: 'Regular Season', // Example season type
        },
      });
  
      return response.data.resultSets[0].rowSet; // Return the game logs
    } catch (error) {
      console.error('Error fetching player game logs:', error);
      throw error;
    }
  };
  
  // Helper function to get player ID from player name
  const getPlayerId = async (playerName) => {
    // For now, use a hardcoded mapping of player names to IDs
    const playerIdMap = {
      'LeBron James': 2544,
      'Stephen Curry': 201939,
      'Kevin Durant': 201142,
      // Add more players as needed
    };
  
    const playerId = playerIdMap[playerName];
  
    if (!playerId) {
      throw new Error(`Player ID not found for ${playerName}`);
    }
  
    return playerId;
  };