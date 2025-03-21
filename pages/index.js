import React, {useState} from "react";
import PlayerInput from '../components/PlayerInput';
import GameSlider from '../components/GameSlider';
import SelectStat from '../components/SelectStat';
import SetLine from '../components/SetLine';
import PlayerInfo from '../components/PlayerInfo';
import Results from '../components/Results';

export default function Home() {
  const [playerName, setPlayerName] = useState('Lebron James');
  const [numGames, setNumGames] = useState(10);
  const [selectedStat, setSelectedStat] = useState('PTS');
  const [lineValue, setLineValue] = useState(25.0);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-4">NBA Player Prop Tool</h1>
        <PlayerInput playerName={playerName} setPlayerName={setPlayerName} />
        <GameSlider numGames={numGames} setNumGames={setNumGames} />
        <SelectStat selectedStat={selectedStat} setSelectedStat={setSelectedStat} />
        <SetLine lineValue={lineValue} setLineValue={setLineValue} />
        <PlayerInfo playerName={playerName} numGames={numGames} selectedStat={selectedStat} lineValue={lineValue} />
        {/* <Results numGames={numGames} /> */}
      </div>
    </div>
  );
}