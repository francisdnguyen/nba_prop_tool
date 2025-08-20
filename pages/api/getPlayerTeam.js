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

  const { PlayerID } = req.query;

  if (!PlayerID) {
    return res.status(400).json({ error: 'PlayerID is required' });
  } 
  
  try {
    const response = await axios.get('https://stats.nba.com/stats/commonplayerinfo', {
      params: {
        PlayerID: PlayerID,
      },
      headers: {
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true',
        'Connection': 'keep-alive',
        'Referer': 'https://stats.nba.com/',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
      },
      timeout: 30000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching NBA data:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch NBA data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
