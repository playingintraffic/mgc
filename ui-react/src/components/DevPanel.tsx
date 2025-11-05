import React, { useState } from 'react';
import { GameName } from '@/types';
import '../styles/DevPanel.css';

interface DevPanelProps {
  onStartGame: (game: GameName, data: any) => void;
}

const games: { name: GameName; label: string }[] = [
  { name: 'skill_bar', label: 'Skill Bar' },
  { name: 'skill_circle', label: 'Skill Circle' },
  { name: 'safe_crack', label: 'Safe Crack' },
  { name: 'anagram', label: 'Anagram' },
  { name: 'button_mash', label: 'Button Mash' },
  { name: 'pattern_lock', label: 'Pattern Lock' },
  { name: 'wire_cut', label: 'Wire Cut' },
  { name: 'pincode', label: 'Pincode' },
  { name: 'tile_shift', label: 'Tile Shift' },
  { name: 'bit_flip', label: 'Bit Flip' },
  { name: 'chip_hack', label: 'Chip Hack' },
  { name: 'key_drop', label: 'Key Drop' },
  { name: 'code_drop', label: 'Code Drop' },
  { name: 'whack_flash', label: 'Whack Flash' },
  { name: 'circuit_trace', label: 'Circuit Trace' },
  { name: 'signal_wave', label: 'Signal Wave' },
  { name: 'pulse_sync', label: 'Pulse Sync' },
  { name: 'packet_snatch', label: 'Packet Snatch' },
  { name: 'frequency_jam', label: 'Frequency Jam' },
  { name: 'hangman', label: 'Hangman' },
];

export const DevPanel: React.FC<DevPanelProps> = ({ onStartGame }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`dev-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="dev-panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fa-solid ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </div>
      {isOpen && (
        <div className="dev-panel-content">
          <h3>Development Panel</h3>
          <p className="dev-panel-info">Select a minigame to test:</p>
          <div className="dev-panel-games">
            {games.map((game) => (
              <button
                key={game.name}
                className="dev-game-button"
                onClick={() => onStartGame(game.name, {})}
              >
                {game.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
