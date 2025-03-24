import NBAWrapper from '../../services/NBAWrapper';

const nba = new NBAWrapper();

// Function to fetch player team
export const fetchPlayerTeam = async (playerName) => {
  try {
    console.log('Fetching player ID for:', playerName);
    // Step 1: Convert player name to player ID using NBAWrapper
    const playerId = await nba.getPlayerId(playerName);
    console.log('Player ID:', playerId);

    if (!playerId) {
      throw new Error('Player ID not found');
    }

    console.log('Fetching player details for player ID:', playerId);
    // Step 2: Fetch player team using NBAWrapper
    const teamName = await nba.getPlayerTeam(playerId);
    console.log('Team name:', teamName);

    return teamName;
  } catch (error) {
    console.error('Error fetching player team:', error);
    throw error;
  }
};

// Function to fetch player game logs
export const fetchPlayerGameLogs = async (playerName, selectedStat, numGames) => {
  try {
    console.log('Fetching player ID for:', playerName);
    // Step 1: Convert player name to player ID using NBAWrapper
    const playerId = await nba.getPlayerId(playerName);
    console.log('Player ID:', playerId);

    if (!playerId) {
      throw new Error('Player ID not found');
    }

    console.log('Fetching player results for player ID:', playerId);
    // Step 2: Fetch player game logs using NBAWrapper
    const response = await nba.getPlayerGameLogs({
      PlayerID: playerId,
      LastNGames: numGames,
      Season: nba.getCurrentSeason(),
      SeasonType: 'Regular Season',
    });

    console.log('Player results response:', response);

    const resultSet = response.resultSets[0];
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