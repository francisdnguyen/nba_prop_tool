import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { PlayerID, LastNGames, Season, SeasonType } = req.query;

  try {
    // Fetch player game logs from the NBA API
    const response = await axios.get('https://stats.nba.com/stats/playergamelogs', {
      params: {
        PlayerID: PlayerID,
        LastNGames: LastNGames,
        Season: Season,
        SeasonType: SeasonType,
      },
      headers: {
            'Host': 'stats.nba.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.nba.com/',
            'Origin': 'https://www.nba.com',
            'x-nba-stats-origin': 'stats',
            'x-nba-stats-token': 'true',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
      },
      timeout: 30000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching player game logs:', error.response?.data || error.message);

    if (error.code === 'ECONNRESET') {
      res.status(500).json({ error: 'Connection to the NBA API was reset. Please try again.' });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch player game logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
