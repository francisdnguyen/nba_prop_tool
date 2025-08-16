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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-lg font-semibold text-gray-300">Loading player info...</p>
        </div>
      </div>
     );
   }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <p className="text-lg font-semibold text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }
      
  return (
    <div className="mt-6 text-center">
      <div className="inline-block bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white leading-relaxed">
          <span className="text-blue-400">Team:</span> <span className="text-yellow-400">{teamName}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-green-400">{playerName}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-purple-400">Stat:</span> <span className="text-red-400">{selectedStat}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-orange-400">Games:</span> <span className="text-cyan-400">{numGames}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-pink-400">Line:</span> <span className="text-lime-400">{lineValue}</span>
        </h2>
      </div>
    </div>
  );
};

export default PlayerInfo;