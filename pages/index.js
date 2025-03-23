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
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-4">
          NBA Player Prop Tool
        </h1>
        {/* Input Components */}
        <PlayerInput playerName={playerName} setPlayerName={setPlayerName} />
        <GameSlider numGames={numGames} setNumGames={setNumGames} />
        <SelectStat selectedStat={selectedStat} setSelectedStat={setSelectedStat} />
        <SetLine lineValue={lineValue} setLineValue={setLineValue} />

        {/* Update button */}
        <div className="flex justify-center my-6">
          <button
            onClick={handleUpdate}
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 text-lg"
          >
            Update
          </button>
        </div>

        <PlayerInfo playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
        <Results playerName={newPlayerName} numGames={newNumGames} selectedStat={newSelectedStat} lineValue={newLineValue} />
      </div>
    </div>
  );
}