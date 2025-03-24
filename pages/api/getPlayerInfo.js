import axios from 'axios';
import NBAWrapper from '../../services/NBAWrapper';

const nba = new NBAWrapper();

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://stats.nba.com/stats/commonallplayers', {
      params: {
        IsOnlyCurrentSeason: 1,
        LeagueID: '00',
        Season: nba.getCurrentSeason(),
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
    console.error('Error fetching NBA data:', error);
    res.status(500).json({ error: 'Failed to fetch NBA data' });
  }
}