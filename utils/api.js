import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000'; // Next.js server URL

// Function to fetch player team
export const fetchPlayerTeam = async (playerName) => {
  try {
    console.log('Fetching player ID for:', playerName);
    // Step 1: Convert player name to player ID using the backend API
    const response = await axios.post(`${BACKEND_URL}/api/getPlayerId`, {
      playerName,
    });
    console.log('Player ID response:', response.data);

    const playerId = response.data.playerId;
    if (!playerId) {
      throw new Error('Player ID not found');
    }
    console.log('Fetching player details for player ID:', playerId);
    
    // Step 2: Fetch player details to get the team name
    const playerDetails = await axios.get(`${BACKEND_URL}/api/getPlayerDetails`, {
      params: {
        PlayerID: playerId,
      },
    });
    console.log('Player details response:', playerDetails.data);
  
    const resultSet = playerDetails.data.resultSets[0];
    if (!resultSet.rowSet.length) {
      throw new Error('Player details not found');
    }

    // Dynamically find the index of TEAM_NAME
    const headers = resultSet.headers;
    const teamNameIndex = headers.indexOf('TEAM_NAME');
    if (teamNameIndex === -1) {
      throw new Error('TEAM_NAME not found in response');
    }

    const teamName = resultSet.rowSet[0][teamNameIndex];
    console.log('Team name:', teamName);
    return teamName;

  } catch (error) {
    console.error('Error fetching player team:', error);
    throw error;
  }
};

// Function to fetch player results (game logs)
export const fetchPlayerResults = async (playerName, selectedStat, numGames) => {
  try {
    console.log('PlayerResults: Fetching player ID for:', playerName);
    // Step 1: Convert player name to player ID using the backend API
    const responseID = await axios.post(`${BACKEND_URL}/api/getPlayerId`, {
      playerName,
    });
    console.log('Player ID response:', responseID.data);

    const playerId = responseID.data.playerId;
    if (!playerId) {
      throw new Error('Player ID not found');
    }
    console.log('Fetching player results for playerId:', playerId);
    const response = await axios.get(`${BACKEND_URL}/api/getPlayerResults`, {
      params: {
        PlayerID: playerId,
        LastNGames: numGames,
        Season: getCurrentSeason(), // Use the helper function to get the current season
        SeasonType: 'Regular Season',
      },
    });
    console.log('Player results response:', response.data);

    const resultSet = response.data.resultSets[0];
    if (!resultSet.rowSet.length) {
      throw new Error('No game logs found for the player');
    }

    // Dynamically find the index of the selected stat
    const headers = resultSet.headers;
    const statIndex = headers.indexOf(selectedStat);
    const gameDateIndex = headers.indexOf('GAME_DATE');
    const matchupIndex = headers.indexOf('MATCHUP');
    const teamAbbreviationIndex = headers.indexOf('TEAM_ABBREVIATION');

    if (statIndex === -1) {
      throw new Error(`Stat "${selectedStat}" not found in response`);
    }
    if (gameDateIndex === -1 || matchupIndex === -1 || teamAbbreviationIndex === -1) {
      throw new Error('Required fields (GAME_DATE, MATCHUP, TEAM_ABBREVIATION) not found in response');
    }

    // Extract game logs and format them for the chart
    const gameLogs = resultSet.rowSet.slice(0, numGames).map((game) => {
      const gameDate = new Date(game[gameDateIndex]);
      const matchup = game[matchupIndex];
      const opposingTeam = matchup.includes('vs.') ? matchup.split('vs. ')[1] : matchup.split('@ ')[1];
      const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;

      return {
        label: `${formattedDate} \n@${opposingTeam}`, // Format: MM/DD @OpposingTeam
        [selectedStat]: game[statIndex], // Selected stat value
      };
    });

    console.log('Game logs extracted:', gameLogs);
    return gameLogs;

  } catch (error) {
    console.error('Error fetching player results:', error);
    throw error;
  }
};


// Helper function to get the current NBA season
const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are 0-indexed

  // NBA season typically starts in October
  if (month >= 10) {
    return `${year}-${(year + 1).toString().slice(-2)}`; // e.g., 2023-24
  } else {
    return `${year - 1}-${year.toString().slice(-2)}`; // e.g., 2022-23
  }
};