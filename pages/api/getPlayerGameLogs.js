import axios from 'axios';


export default async function handler(req, res) {
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://stats.nba.com/',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching player game logs:', error);

    if (error.code === 'ECONNRESET') {
      res.status(500).json({ error: 'Connection to the NBA API was reset. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch player game logs' });
    }
  }
}   