import React from 'react';
import { useTheme } from './ThemeContext';

const GameSlider = ({ numGames, setNumGames }) => {
  const { colors } = useTheme();

  return (
    <div className="mb-6">
      <label className={`block text-xl mb-6 font-semibold ${colors.textSecondary}`} htmlFor="number-of-games">
        Number of Games
      </label>
      <div className="relative">
        {/* Current Value Display */}
        <div 
          className={`absolute -top-12 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-sm font-bold shadow-lg transform -translate-x-1/2 transition-all duration-200 ${colors.textSecondary}`}
          style={{
            left: `calc(${(numGames - 1) * (100 / 19)}% + ${
              numGames <= 4 ? '0.5rem' : 
              numGames <= 7 ? '0.25rem' : 
              numGames <= 9 ? '0.1rem' : 
              numGames <= 11 ? '-0.25rem' :
              numGames <= 14 ? '-0.4rem' :
              numGames <= 17 ? '-0.55rem' :
              numGames <= 19 ? '-0.6rem' : '-0.65rem'
            })`,
          }}
        >
          {numGames}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
        </div>
        
        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            id="number-of-games"
            min="1"
            max="20"
            value={numGames}
            onChange={(e) => setNumGames(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: colors.isDarkMode 
                ? 'linear-gradient(to right, #374151, #4b5563)'
                : 'linear-gradient(to right, #d1d5db, #9ca3af)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg pointer-events-none" />
        </div>
        
        {/* Min and Max Labels */}
        <div className={`flex justify-between text-sm ${colors.textTertiary} mt-3 font-medium`}>
          <span>1</span>
          <span>20</span>
        </div>
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
        }
        .slider-thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
      `}</style>
    </div>
  );
};

export default GameSlider;