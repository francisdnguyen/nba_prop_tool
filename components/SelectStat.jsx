import React from 'react';

const SelectStat = ({ selectedStat, setSelectedStat }) => {
  const stats = ['PTS', 'REB', 'AST', 'STL', 'BLK', 'MIN', 'FG3M'];

  return (
    <div className="mt-6">
      <label className="block text-sm mb-3 font-semibold text-gray-200">Select Stat</label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 p-1 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-600/50">
        {stats.map((stat) => (
          <button
            key={stat}
            onClick={() => setSelectedStat(stat)}
            className={`relative overflow-hidden py-3 px-2 text-sm font-bold transition-all duration-300 rounded-lg group ${
              selectedStat === stat
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 scale-105' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
            }`}
          >
            <span className="relative z-10">{stat}</span>
            {selectedStat === stat && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectStat;