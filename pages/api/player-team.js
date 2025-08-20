import NBAWrapper from '../../services/NBAWrapper';

// Create NBAWrapper instance with base URL for server-side requests
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
const nba = new NBAWrapper(baseURL);

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

  const { playerName } = req.query;

  if (!playerName) {
    res.status(400).json({ error: 'Player name is required' });
    return;
  }

  try {
    console.log('Fetching player ID for:', playerName);
    const playerId = await nba.getPlayerId(playerName);
    console.log('Player ID:', playerId);

    if (!playerId) {
      throw new Error('Player ID not found');
    }

    console.log('Fetching player details for player ID:', playerId);
    const teamName = await nba.getPlayerTeam(playerId);
    console.log('Team name:', teamName);

    res.status(200).json({ teamName });
  } catch (error) {
    console.error('Error fetching player team:', error);
    res.status(500).json({ error: error.message });
  }
}