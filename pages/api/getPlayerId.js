import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const { playerName } = req.body;

  console.log('Received request for player:', playerName);
  
  // Path to the Python script
  const scriptPath = path.join(process.cwd(), 'scripts', 'findPlayerId.py');

  // Run the Python script
  const pythonProcess = spawn('python', [scriptPath, playerName]);

  let playerId = null;
  let error = null;

  pythonProcess.stdout.on('data', (data) => {
    playerId = data.toString().trim();
  });

  pythonProcess.stderr.on('data', (data) => {
    error = data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0 && playerId) {
      res.status(200).json({ playerId });
      return res.status(200).json({ playerId });
    } else {
      res.status(404).json({ error: error || 'Player not found' });
    }
  });
}