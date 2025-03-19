import React from 'react';

const PlayerInput = ({ playerName, setPlayerName }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm mb-2" htmlFor="player-name">
        Enter Player Name
      </label>
      <input
        type="text"
        id="player-name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="rounded w-full py-2 px-3 bg-gray-700 text-whitecl"
        placeholder="LeBron James"
      />
    </div>
  );
};

export default PlayerInput;