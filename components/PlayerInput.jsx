import React from 'react';

const PlayerInput = ({ playerName, setPlayerName }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm mb-3 font-semibold text-gray-200" htmlFor="player-name">
        Enter Player Name
      </label>
      <div className="relative">
        <input
          type="text"
          id="player-name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full py-4 px-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          placeholder="LeBron James"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

export default PlayerInput;