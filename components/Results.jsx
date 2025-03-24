import React, { useState, useEffect } from 'react';
import { fetchPlayerGameLogs } from '../pages/api/api';

import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell, LabelList} from 'recharts';

const Results = ({ playerName, selectedStat, numGames, lineValue }) => {
  const [gameLogs, setGameLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Counters for hit rate
  const [greenCount, setGreenCount] = useState(0);
  const [redCount, setRedCount] = useState(0);

  const calculateHitRate = () => {
    const total = greenCount + redCount;
    if (total === 0) return 0;
    return ((greenCount / total) * 100).toFixed(2);
  };
  const hitRate = calculateHitRate();

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      try {
        console.log('Fetching player results...');
        const logs = await fetchPlayerGameLogs(playerName, selectedStat, numGames);
        // Only update state if the component is still mounted
        if (isMounted) {
          setGameLogs(logs);

          // Calculate greenCount and redCount
          let green = 0;
          let red = 0;
          logs.forEach((entry) => {
            if (entry[selectedStat] >= lineValue) {
              green++;
            } else {
              red++;
            }
          });

          setGreenCount(green);
          setRedCount(red);

          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching player results:', err);
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
  }, [playerName, selectedStat, numGames]);

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

  // Custom tick component to render multi-line labels
  const CustomTick = ({ x, y, payload }) => {
    const [date, team] = payload.value.split('\n'); // Split the label into date and team
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="white">
          {date}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill="white">
          {team}
        </text>
      </g>
    );
  };

  return (
    <div className="mt-6">
      <BarChart
        width={800}
        height={400}
        data={gameLogs}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="label" stroke='white' tick={<CustomTick />} height={60} />
        <YAxis stroke='white'/>
        <Bar dataKey={selectedStat}>
            {gameLogs.map((entry, index) => {
              const isGreen = entry[selectedStat] >= lineValue;
              return (
                <Cell
                    key={`cell-${index}`}
                    fill={isGreen ? '#4CAF50' : '#FF5252'} // Green or Red based on value
                />
              );
              })}
            <LabelList dataKey={selectedStat} position="top" fill="white" />
        </Bar>
        <ReferenceLine
          y={lineValue}
          stroke="white"
          strokeWidth={2}
        />
      </BarChart>
      
      <div className="mt-6 flex items-center justify-center">
        <h2 className="text-xl font-bold">
          Hit Rate: {hitRate} %
        </h2>
      </div>
    </div>
  );
};

export default Results;