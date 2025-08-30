import React, {useState} from "react";
import PlayerInput from '../components/PlayerInput';
import GameSlider from '../components/GameSlider';
import SelectStat from '../components/SelectStat';
import SetLine from '../components/SetLine';
import PlayerInfo from '../components/PlayerInfo';
import Results from '../components/Results';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

// Main app content component (separate so it can use theme context)
function AppContent() {
  const { colors } = useTheme();
  
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
    <div className={`min-h-screen bg-gradient-to-br ${colors.primary}`}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Theme Toggle Button - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className={`relative z-10 ${colors.textPrimary} min-h-screen p-6`}>
        <div className="max-w-full mx-auto px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <h1 className={`text-7xl font-semibold mb-6 ${colors.textPrimary} tracking-wide drop-shadow-lg`}>
              NBA Player Prop Tool
            </h1>
            <div className={`w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6`} />
            <p className={`text-xl ${colors.textTertiary} font-medium`}>
              Analyze player performance with precision
            </p>
          </div>

          {/* Main Content Grid - Wider columns */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Controls (Wider) */}
            <div className="space-y-8">
              <div className={`${colors.secondary} ${colors.backdrop} rounded-2xl p-8 ${colors.border} border shadow-xl`}>
                <h2 className={`text-2xl font-semibold mb-8 text-center ${colors.textSecondary}`}>
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
                  className={`group relative overflow-hidden ${colors.button} ${colors.buttonText} px-16 py-5 rounded-xl font-semibold text-xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-700/25 hover:scale-[1.02] active:scale-[0.98] ${colors.buttonBorder} border`}
                >
                  <span className="relative z-10">Update Analysis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-500/20 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            </div>

            {/* Right Column - Results (Wider) */}
            <div className="space-y-8">
              <div className={`${colors.secondary} ${colors.backdrop} rounded-2xl p-8 ${colors.border} border shadow-xl`}>
                <h2 className={`text-2xl font-semibold mb-8 text-center ${colors.textSecondary}`}>
                  Analysis Results
                </h2>
                <PlayerInfo playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
              
              <div className={`${colors.secondary} ${colors.backdrop} rounded-2xl p-8 ${colors.border} border shadow-xl`}>
                <Results playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with theme provider wrapper
export default function Home() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}