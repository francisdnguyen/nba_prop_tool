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
    // Request extra games to account for API inconsistency
    const requestedGames = Math.min(parseInt(numGames) + 3, 82); // Request 3 extra games as buffer, max 82
    const response = await nba.getPlayerGameLogs({
      PlayerID: playerId,
      LastNGames: requestedGames,
      Season: nba.getCurrentSeason(),
      SeasonType: 'Regular Season',
    });

    console.log('Player results response:', response);

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

    // Log the actual data received for debugging
    console.log(`Requested ${numGames} games, received ${resultSet.rowSet.length} games from API`);

    // Extract game logs and format them for the chart
    // Now slice to get exactly the number of games requested
    const gameLogs = resultSet.rowSet
      .slice(0, parseInt(numGames)) // Ensure we get exactly numGames
      .map((game) => {
        const gameDate = new Date(game[gameDateIndex]);
        const matchup = game[matchupIndex];
        const opposingTeam = matchup.includes('vs.') ? matchup.split('vs. ')[1] : matchup.split('@ ')[1];
        const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;

        return {
          label: `${formattedDate}\n@${opposingTeam}`,
          [selectedStat]: game[statIndex],
        };
      });

    // Ensure we have enough games, if not throw a descriptive error
    if (gameLogs.length < parseInt(numGames)) {
      console.warn(`Only found ${gameLogs.length} games, but ${numGames} were requested`);
      console.warn('This might be because the player has not played enough recent games');
    }

    console.log('Game logs extracted:', gameLogs);
    console.log(`Final result: ${gameLogs.length} games returned`);
    res.status(200).json({ gameLogs });
  } catch (error) {
    console.error('Error fetching player game logs:', error);
    res.status(500).json({ error: error.message });
  }
}