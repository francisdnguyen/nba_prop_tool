import NBAWrapper from '../../services/NBAWrapper';

// Create NBAWrapper instance with base URL for server-side requests
// On Vercel, use the deployment URL, otherwise use localhost for development
const getBaseURL = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return ''; // Use relative URLs in production if VERCEL_URL is not available
  }
  return 'http://localhost:3000';
};

const nba = new NBAWrapper(getBaseURL());

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { playerName, selectedStat, numGames } = req.query;

  if (!playerName || !selectedStat || !numGames) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    console.log('Fetching player ID for:', playerName);
    const playerId = await nba.getPlayerId(playerName);
    console.log('Player ID:', playerId);

    if (!playerId) {
      throw new Error('Player ID not found');
    }

    console.log('Fetching player results for player ID:', playerId);
    
    // Try different strategies to get enough games
    const targetGames = parseInt(numGames);
    let gameLogs = [];
    
    // Strategy 1: Request significantly more games to account for API limitations
    const bufferMultiplier = targetGames <= 10 ? 2 : targetGames <= 15 ? 1.5 : 1.3;
    const requestedGames = Math.min(Math.ceil(targetGames * bufferMultiplier), 82);
    
    console.log(`Requesting ${requestedGames} games from API to get ${targetGames} games`);
    
    const response = await nba.getPlayerGameLogs({
      PlayerID: playerId,
      LastNGames: requestedGames,
      Season: nba.getCurrentSeason(),
      SeasonType: 'Regular Season',
    });

    console.log('Player results response received');

    const resultSet = response.resultSets[0];
    if (!resultSet.rowSet.length) {
      throw new Error('No game logs found for the player');
    }

    const headers = resultSet.headers;
    const statIndex = headers.indexOf(selectedStat);
    const gameDateIndex = headers.indexOf('GAME_DATE');
    const matchupIndex = headers.indexOf('MATCHUP');

    if (statIndex === -1) {
      throw new Error(`Stat "${selectedStat}" not found in response`);
    }
    if (gameDateIndex === -1 || matchupIndex === -1) {
      throw new Error('Required fields not found in response');
    }

    console.log(`API returned ${resultSet.rowSet.length} games`);

    // Extract and format all available games first
    const allGameLogs = resultSet.rowSet.map((game) => {
      const gameDate = new Date(game[gameDateIndex]);
      const matchup = game[matchupIndex];
      const opposingTeam = matchup.includes('vs.') ? matchup.split('vs. ')[1] : matchup.split('@ ')[1];
      const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;

      return {
        label: `${formattedDate}\n@${opposingTeam}`,
        [selectedStat]: game[statIndex],
        gameDate: gameDate, // Keep for potential sorting
      };
    });

    // Sort by date (most recent first) to ensure we get the most recent games
    allGameLogs.sort((a, b) => b.gameDate - a.gameDate);

    // Take exactly what was requested, or all available if less
    gameLogs = allGameLogs.slice(0, targetGames).map(game => ({
      label: game.label,
      [selectedStat]: game[selectedStat]
    }));

    console.log(`Requested ${targetGames} games, API returned ${resultSet.rowSet.length} games, sending ${gameLogs.length} games`);

    // Strategy 2: If we still don't have enough games, try requesting more
    if (gameLogs.length < targetGames && requestedGames < 82) {
      console.log(`Not enough games (${gameLogs.length}/${targetGames}). Trying to request more...`);
      
      const secondRequest = Math.min(targetGames * 2, 82);
      const secondResponse = await nba.getPlayerGameLogs({
        PlayerID: playerId,
        LastNGames: secondRequest,
        Season: nba.getCurrentSeason(),
        SeasonType: 'Regular Season',
      });

      const secondResultSet = secondResponse.resultSets[0];
      console.log(`Second request returned ${secondResultSet.rowSet.length} games`);
      
      if (secondResultSet.rowSet.length > resultSet.rowSet.length) {
        // Re-process with the larger dataset
        const newAllGameLogs = secondResultSet.rowSet.map((game) => {
          const gameDate = new Date(game[gameDateIndex]);
          const matchup = game[matchupIndex];
          const opposingTeam = matchup.includes('vs.') ? matchup.split('vs. ')[1] : matchup.split('@ ')[1];
          const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;

          return {
            label: `${formattedDate}\n@${opposingTeam}`,
            [selectedStat]: game[statIndex],
            gameDate: gameDate,
          };
        });

        newAllGameLogs.sort((a, b) => b.gameDate - a.gameDate);
        gameLogs = newAllGameLogs.slice(0, targetGames).map(game => ({
          label: game.label,
          [selectedStat]: game[selectedStat]
        }));
        
        console.log(`After second request: sending ${gameLogs.length} games`);
      }
    }

    if (gameLogs.length < targetGames) {
      console.warn(`Warning: Only found ${gameLogs.length} games out of ${targetGames} requested. Player may not have played enough recent games.`);
    }

    res.status(200).json({ gameLogs });
  } catch (error) {
    console.error('Error fetching player game logs:', error);
    res.status(500).json({ error: error.message });
  }
}