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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.05)_50%,transparent_75%)] pointer-events-none" />
      
      <div className="relative z-10 text-white min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                NBA Player Prop Tool
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full opacity-60" />
            </div>
            <p className="text-xl text-gray-300 mt-6 font-light">
              Analyze player performance with advanced statistics
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-8">
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/25 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Update Analysis</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-700 blur group-hover:blur-xl transition-all duration-300" />
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-8">
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Analysis Results
                </h2>
                <PlayerInfo playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
              
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
                <Results playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}