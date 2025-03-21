import React, { useState, useEffect } from 'react';
// import { fetchPlayerGameLogs } from '../api'; // Import the API function

const PlayerInfo = ({playerName, numGames, selectedStat, lineValue}) => {
    const [gameLogs, setGameLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch player game logs
            const logs = await fetchPlayerGameLogs(playerName, numGames);
            setGameLogs(logs);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [playerName]);

    {/* if the player cant be found, adjust info to show No Player Found
        create a function and put it inside className instead */}
  return (
    <div className="mt-6 flex items-center justify-center">
      <h2 className="text-xl font-bold">
        Team: Get Cake before work, {playerName}, Stat: {selectedStat},  Games: {numGames}, Line: {lineValue }
      </h2>
    </div>
  );
};

export default PlayerInfo;