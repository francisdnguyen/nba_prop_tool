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
    // Request extra games to account for API inconsistency
    const response = await nba.getPlayerGameLogs({
      PlayerID: playerId,
      LastNGames: Math.min(numGames + 3, 82), // Request 3 extra games as buffer, max 82
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

    // Log the actual data received for debugging
    console.log(`Requested ${numGames} games, received ${resultSet.rowSet.length} games`);

    // Extract game logs and format them for the chart
    // Now slice to get exactly the number of games requested
    const gameLogs = resultSet.rowSet
      .slice(0, numGames) // Ensure we get exactly numGames
      .map((game) => {
        const gameDate = new Date(game[gameDateIndex]);
        const matchup = game[matchupIndex];
        const opposingTeam = matchup.includes('vs.') ? matchup.split('vs. ')[1] : matchup.split('@ ')[1];
        const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;

        return {
          label: `${formattedDate}\n@${opposingTeam}`, // Format: MM/DD @OpposingTeam
          [selectedStat]: game[statIndex], // Selected stat value
        };
      });

    // Ensure we have enough games, if not throw a descriptive error
    if (gameLogs.length < numGames) {
      console.warn(`Only found ${gameLogs.length} games, but ${numGames} were requested`);
      console.warn('This might be because the player has not played enough recent games');
    }

    console.log('Game logs extracted:', gameLogs);
    console.log(`Final result: ${gameLogs.length} games returned`);
    return gameLogs;
  } catch (error) {
    console.error('Error fetching player results:', error);
    throw error;
  }
};