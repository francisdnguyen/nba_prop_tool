import React from 'react';

<<<<<<< HEAD
{/* Creates a line of buttons representing different stats */}
=======
>>>>>>> 65d1113a13fbd14691393881e8fe31191be320dc
const SelectStat = ({ selectedStat, setSelectedStat }) => {
  const stats = ['PTS', 'REB', 'AST', 'STL', 'BLK', 'PRA', '3PTM'];

  return (
    <div className="mt-6">
      <label className="block text-sm mb-2">Select Stat</label>
      <div className="flex bg-gray-700 rounded-lg border border-gray-500"> {/* Container for the solid bar */}
        {stats.map((stat, index) => (
          <button
            key={stat}
            onClick={() => setSelectedStat(stat)}
            className={`flex-1 p-2 text-sm font-bold transition-colors ${
              selectedStat === stat
                ? 'bg-red-500 text-white' // Selected stat style
                : 'bg-transparent text-gray-300 hover:bg-gray-600' // Unselected stat style
            }  ${
              index !== stats.length - 1 ? 'border-r border-gray-500' : '' // Add white line between buttons
            } ${
              index === 0 ? 'rounded-l-md' : '' // Round left corner for first button
            } ${
              index === stats.length - 1 ? 'rounded-r-md' : '' // Round right corner for last button
            }`}
          >
            {stat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectStat;