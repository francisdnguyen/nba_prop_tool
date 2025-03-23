import React, {useState, useEffect} from "react";
import { fetchPlayerTeam } from '../utils/api'; // Import the API function

const PlayerInfo = ({playerName, numGames, selectedStat, lineValue}) => {
    const [teamName, setTeamName] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted

        const fetchData = async () => {
          try {
            // Fetch player game logs
            console.log('Fetching team for player:', playerName);
            const team = await fetchPlayerTeam(playerName);

            // Only update state if the component is still mounted
            if (isMounted) {
              console.log('Team name received:', team);
              setTeamName(team);
              setLoading(false);
            }
          } catch (err) {
            console.error('Error in fetchData:', err);
            // Only update state if the component is still mounted
            if (isMounted) {
              setError(err.message);
              setLoading(false);
            }
          } 
        };
    
        fetchData();

        // Cleanup function to cancel the request or ignore the result
        return () => {
          isMounted = false;
        };
      }, [playerName]);
      
      if (loading) {
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-bold">Loading...</p>
          </div>
        );
      }
      if (error) {
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-bold">Error: {error}</p>
          </div>
        );
      }
      
  return (
    <div className="mt-6 flex items-center justify-center">
      <h2 className="text-xl font-bold">
        Team: {teamName}, {playerName}, Stat: {selectedStat},  Games: {numGames}, Line: {lineValue }
      </h2>
    </div>
  );
};

export default PlayerInfo;