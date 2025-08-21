import React, {useState, useEffect} from "react";
import {fetchPlayerTeam} from '../pages/api/api';

const PlayerInfo = ({playerName, numGames, selectedStat, lineValue}) => {
  const [teamName, setTeamName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const team = await fetchPlayerTeam(playerName);
        if (isMounted) {
          setTeamName(team);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      } 
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [playerName]);
      
  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <p className="text-xl font-semibold text-gray-300">Loading player info...</p>
        </div>
      </div>
     );
   }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">⚠️</div>
          <p className="text-xl font-semibold text-gray-400">Error: {error}</p>
        </div>
      </div>
    );
  }
      
  return (
    <div className="mt-6 text-center">
      <div className="inline-block bg-gray-700/20 backdrop-blur-sm border border-gray-600/30 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-200 leading-relaxed">
          <span className="text-gray-400">Team:</span> <span className="text-white">{teamName}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-white">{playerName}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-400">Stat:</span> <span className="text-white">{selectedStat}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-400">Games:</span> <span className="text-white">{numGames}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-400">Line:</span> <span className="text-white">{lineValue}</span>
        </h2>
      </div>
    </div>
  );
};

export default PlayerInfo;