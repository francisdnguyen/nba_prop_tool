// index.js - Enhanced with modern styling
import React, {useState} from "react";
import PlayerInput from '../components/PlayerInput';
import GameSlider from '../components/GameSlider';
import SelectStat from '../components/SelectStat';
import SetLine from '../components/SetLine';
import PlayerInfo from '../components/PlayerInfo';
import Results from '../components/Results';

export default function Home() {
  // State for selected options
  const [playerName, setPlayerName] = useState('Lebron James');
  const [numGames, setNumGames] = useState(10);
  const [selectedStat, setSelectedStat] = useState('PTS');
  const [lineValue, setLineValue] = useState(25.0);

  // State to store the values used for rendering PlayerInfo and Results
  const [newPlayerName, setNewPlayerName] = useState(playerName);
  const [newNumGames, setNewNumGames] = useState(numGames);
  const [newSelectedStat, setNewSelectedStat] = useState(selectedStat);
  const [newLineValue, setNewLineValue] = useState(lineValue);

  // Handler for the Update button
  const handleUpdate = () => {
    // Update the display states with the current input values
    setNewPlayerName(playerName);
    setNewNumGames(numGames);
    setNewSelectedStat(selectedStat);
    setNewLineValue(lineValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative z-10 text-white min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <h1 className="text-7xl font-semibold mb-6 text-white tracking-wide drop-shadow-lg">
              NBA Player Prop Tool
            </h1>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6" />
            <p className="text-xl text-gray-300 font-medium">
              Analyze player performance with precision
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-8">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-semibold mb-8 text-center text-gray-200">
                  Player Controls
                </h2>
                <div className="space-y-6">
                  <PlayerInput playerName={playerName} setPlayerName={setPlayerName} />
                  <GameSlider numGames={numGames} setNumGames={setNumGames} />
                  <SelectStat selectedStat={selectedStat} setSelectedStat={setSelectedStat} />
                  <SetLine lineValue={lineValue} setLineValue={setLineValue} />
                </div>
              </div>

              {/* Update button */}
              <div className="flex justify-center">
                <button
                  onClick={handleUpdate}
                  className="group relative overflow-hidden bg-gray-700 hover:bg-gray-600 text-white px-16 py-5 rounded-xl font-semibold text-xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-700/25 hover:scale-[1.02] active:scale-[0.98] border border-gray-600/50"
                >
                  <span className="relative z-10">Update Analysis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-500/20 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-8">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-semibold mb-8 text-center text-gray-200">
                  Analysis Results
                </h2>
                <PlayerInfo playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                <Results playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}