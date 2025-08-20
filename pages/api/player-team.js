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
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}