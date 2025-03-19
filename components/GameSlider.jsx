import React from 'react';

const GameSlider = ({ numGames, setNumGames }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm mb-6" htmlFor="number-of-games">
        Number of Games
      </label>
      <div className="relative">
        {/* Current Value Display */}
        <div className="absolute -top-6 px-3 py-1 rounded-lg text-sm font-bold "
        style={{
            left: `calc(${(numGames - 1) * (100 / 19)}% - ${
              numGames <= 4 ? '.5rem' : 
              numGames <= 7 ? '.75rem' : 
              numGames <= 9 ? '.9rem' : 
              numGames <= 11 ? '1.25rem' :
              numGames <= 14 ? '1.4rem' :
              numGames <= 17 ? '1.55rem' :
              numGames <= 19 ? '1.6rem' : '1.65rem'
            })`,
          }}
        >
          {numGames}
        </div>
        {/* Slider */}
        <input
            type="range"
            id="number-of-games"
            min="1"
            max="20"
            value={numGames}
            onChange={(e) => setNumGames(Number(e.target.value))}
            className="w-full"
            style={{
                 accentColor: '#ef4444',
            }}
        />
        {/* Min and Max Labels */}
        <div className="flex justify-between text-sm text-white mt-2">
          <span font-bold>1</span>
          <span font-bold>20</span>
        </div>
      </div>
    </div>
  );
};

export default GameSlider;