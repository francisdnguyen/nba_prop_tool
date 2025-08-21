import React, { useState, useEffect } from 'react';
import { fetchPlayerGameLogs } from '../pages/api/api';
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell, LabelList} from 'recharts';

const Results = ({ playerName, selectedStat, numGames, lineValue }) => {
  const [gameLogs, setGameLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greenCount, setGreenCount] = useState(0);
  const [redCount, setRedCount] = useState(0);

  const calculateHitRate = () => {
    const total = greenCount + redCount;
    if (total === 0) return 0;
    return ((greenCount / total) * 100).toFixed(2);
  };
  const hitRate = calculateHitRate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log('Fetching player results...');
        const logs = await fetchPlayerGameLogs(playerName, selectedStat, numGames);
        if (isMounted) {
          setGameLogs(logs);

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
  }, [playerName, selectedStat, numGames]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-300">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-xl font-medium text-gray-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  const CustomTick = ({ x, y, payload }) => {
    const [date, team] = payload.value.split('\n');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#9ca3af" fontSize="12">
          {date}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill="#6b7280" fontSize="11">
          {team}
        </text>
      </g>
    );
  };

  return (
    <div className="mt-6">
      <div className="bg-gray-700/20 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 overflow-x-auto">
        <div className="min-w-[800px]">
          <BarChart
            width={Math.max(800, gameLogs.length * 80)}
            height={400}
            data={gameLogs}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <XAxis 
              dataKey="label" 
              stroke='#9ca3af' 
              tick={<CustomTick />} 
              height={80}
              fontSize={12}
              interval={0}
            />
            <YAxis stroke='#9ca3af' fontSize={12}/>
            <Bar dataKey={selectedStat} radius={[4, 4, 0, 0]}>
                {gameLogs.map((entry, index) => {
                  const isGreen = entry[selectedStat] >= lineValue;
                  return (
                    <Cell
                        key={`cell-${index}`}
                        fill={isGreen ? '#10b981' : '#ef4444'}
                    />
                  );
                  })}
                <LabelList 
                  dataKey={selectedStat} 
                  position="top" 
                  fill="#e5e7eb" 
                  fontSize={12}
                  fontWeight="bold"
                />
            </Bar>
            <ReferenceLine
              y={lineValue}
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
            />
          </BarChart>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-block bg-gray-700/20 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
          <h2 className="text-2xl font-medium">
            <span className="text-gray-300">Hit Rate:</span>{' '}
            <span className={`${parseFloat(hitRate) >= 50 ? 'text-green-400' : 'text-red-400'} text-3xl font-semibold`}>
              {hitRate}%
            </span>
          </h2>
          <div className="mt-2 text-sm text-gray-400">
            <span className="text-green-400">{greenCount} hits</span> • <span className="text-red-400">{redCount} misses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;