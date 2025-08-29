import React, { useState, useEffect, useRef } from 'react';
import { fetchPlayerGameLogs } from '../pages/api/api';
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell, LabelList, ResponsiveContainer } from 'recharts';

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

  // Fixed height, dynamic bar sizing only
  const chartHeight = 400; // Fixed height
  
  // Calculate bar size based on number of games - all fit within container
  const getBarSize = () => {
    if (numGames <= 5) return 80;
    if (numGames <= 8) return 60;
    if (numGames <= 12) return 45;
    if (numGames <= 16) return 35;
    if (numGames <= 20) return 25;
    return 20; // For 20+ games
  };

  const maxBarSize = getBarSize();

  // Fixed margins - no need for dynamic margins since height is fixed
  const chartMargins = { top: 25, right: 20, left: 25, bottom: 70 };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log('Fetching player results...');
        console.log('Fetching player results...');
        const logs = await fetchPlayerGameLogs(playerName, selectedStat, numGames);
        console.log(`Requested ${numGames} games, received ${logs.length} games`);
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
  }, [playerName, selectedStat, numGames, lineValue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-300">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-xl font-semibold text-gray-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  const CustomTick = ({ x, y, payload }) => {
    const [date, team] = payload.value.split('\n');
    const fontSize = numGames > 15 ? 9 : numGames > 10 ? 10 : 11;
    const teamFontSize = fontSize - 1;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#9ca3af" 
          fontSize={fontSize}
        >
          {date}
        </text>
        <text 
          x={0} 
          y={0} 
          dy={30} 
          textAnchor="middle" 
          fill="#6b7280" 
          fontSize={teamFontSize}
        >
          {team}
        </text>
      </g>
    );
  };

  // Determine if labels should be rotated based on number of games
  const shouldRotateLabels = numGames > 12;

  return (
    <div className="mt-6">
      {/* Chart Container - Always fits within container width */}
      <div className="bg-gray-700/20 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
        <div className="w-full" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gameLogs}
              margin={chartMargins}
              barCategoryGap={numGames > 12 ? '3%' : '8%'}
            >
              <XAxis 
                dataKey="label" 
                stroke='#9ca3af' 
                tick={<CustomTick />} 
                height={shouldRotateLabels ? 80 : 60}
                fontSize={numGames > 15 ? 9 : 11}
                interval={0}
                angle={shouldRotateLabels ? -45 : 0}
                textAnchor={shouldRotateLabels ? "end" : "middle"}
              />
              <YAxis 
                stroke='#9ca3af' 
                fontSize={12}
                width={40}
              />
              <Bar 
                dataKey={selectedStat} 
                radius={[3, 3, 0, 0]}
                maxBarSize={maxBarSize}
                minPointSize={2}
              >
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
                  fontSize={numGames > 15 ? 8 : numGames > 10 ? 10 : 12}
                  fontWeight="bold"
                />
              </Bar>
              <ReferenceLine
                y={lineValue}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ 
                  value: `Line: ${lineValue}`, 
                  position: "topRight",
                  fill: "#f59e0b",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Hit Rate Display */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-gray-700/20 backdrop-blur-sm border border-gray-600/30 rounded-xl p-8">
          <h2 className="text-3xl font-semibold">
            <span className="text-gray-300">Hit Rate:</span>{' '}
            <span className={`${parseFloat(hitRate) >= 50 ? 'text-green-400' : 'text-red-400'} text-4xl font-bold`}>
              {hitRate}%
            </span>
          </h2>
          <div className="mt-3 text-lg text-gray-400">
            <span className="text-green-400">{greenCount} hits</span> • <span className="text-red-400">{redCount} misses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;