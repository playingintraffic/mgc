import React, { useEffect, useState } from 'react';
import { GameName, NUIMessage, GameData } from '@/types';
import { sendGameResult, isEnvBrowser, debugLog } from '@utils/nui';
import { DevPanel } from '@components/DevPanel';

// Import all games
import { SkillBar } from '@games/SkillBar';
import { SkillCircle } from '@games/SkillCircle';
import { SafeCrack } from '@games/SafeCrack';
import { Anagram } from '@games/Anagram';
import { ButtonMash } from '@games/ButtonMash';
import { PatternLock } from '@games/PatternLock';
import { WireCut } from '@games/WireCut';
import { Pincode } from '@games/Pincode';
import { TileShift } from '@games/TileShift';
import { BitFlip } from '@games/BitFlip';
import { ChipHack } from '@games/ChipHack';
import { KeyDrop } from '@games/KeyDrop';
import { CodeDrop } from '@games/CodeDrop';
import { WhackFlash } from '@games/WhackFlash';
import { CircuitTrace } from '@games/CircuitTrace';
import { SignalWave } from '@games/SignalWave';
import { PulseSync } from '@games/PulseSync';
import { PacketSnatch } from '@games/PacketSnatch';
import { FrequencyJam } from '@games/FrequencyJam';
import { Hangman } from '@games/Hangman';

import './styles/App.css';

const gameComponents: Record<GameName, React.FC<any>> = {
  skill_bar: SkillBar,
  skill_circle: SkillCircle,
  safe_crack: SafeCrack,
  anagram: Anagram,
  button_mash: ButtonMash,
  pattern_lock: PatternLock,
  wire_cut: WireCut,
  pincode: Pincode,
  tile_shift: TileShift,
  bit_flip: BitFlip,
  chip_hack: ChipHack,
  key_drop: KeyDrop,
  code_drop: CodeDrop,
  whack_flash: WhackFlash,
  circuit_trace: CircuitTrace,
  signal_wave: SignalWave,
  pulse_sync: PulseSync,
  packet_snatch: PacketSnatch,
  frequency_jam: FrequencyJam,
  hangman: Hangman,
};

function App() {
  const [currentGame, setCurrentGame] = useState<GameName | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<NUIMessage>) => {
      const { action, game, data } = event.data;

      if (action === 'start_minigame') {
        debugLog('Starting game:', game, data);
        setCurrentGame(game);
        setGameData(data);
        setIsVisible(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGameComplete = (success: boolean) => {
    if (currentGame) {
      debugLog('Game completed:', currentGame, success);
      sendGameResult({ success, game: currentGame });
    }

    // Hide UI after a short delay
    setTimeout(() => {
      setIsVisible(false);
      setCurrentGame(null);
      setGameData(null);
    }, 100);
  };

  const handleDevStart = (game: GameName, data: any) => {
    debugLog('Dev mode: Starting game:', game);
    setCurrentGame(game);
    setGameData({ game, ...data });
    setIsVisible(true);
  };

  const GameComponent = currentGame ? gameComponents[currentGame] : null;

  return (
    <div className="app-container">
      {isEnvBrowser() && <DevPanel onStartGame={handleDevStart} />}

      {isVisible && GameComponent && gameData && (
        <div className="main-container">
          <GameComponent data={gameData} onComplete={handleGameComplete} />
        </div>
      )}
    </div>
  );
}

export default App;
