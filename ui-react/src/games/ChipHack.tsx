import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, ChipHackData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/ChipHack.css';

export const ChipHack: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as ChipHackData;
  const gridSize = gameData.grid_size || 5;
  const chipCount = gameData.chips || 3;
  const timerDuration = gameData.timer || 30000;

  const [chipPositions, setChipPositions] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [found, setFound] = useState<Set<number>>(new Set());
  const [clicks, setClicks] = useState(0);
  const maxClicks = chipCount + 3;
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    },
  });

  useEffect(() => {
    const positions: number[] = [];
    while (positions.length < chipCount) {
      const pos = Math.floor(Math.random() * (gridSize * gridSize));
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    setChipPositions(positions);
  }, [gridSize, chipCount]);

  const handleCellClick = (index: number) => {
    if (showResult || revealed.has(index)) return;

    const newRevealed = new Set(revealed);
    newRevealed.add(index);
    setRevealed(newRevealed);

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (chipPositions.includes(index)) {
      const newFound = new Set(found);
      newFound.add(index);
      setFound(newFound);

      if (newFound.size === chipCount) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      }
    }

    if (newClicks >= maxClicks && found.size < chipCount) {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="CHIP HACK" timer={timeLeft} className="chip-hack-game">
      <div className="chip_hack_container">
        <div className="chip_hack_info">
          <span>Chips found: {found.size} / {chipCount}</span>
          <span>Clicks: {clicks} / {maxClicks}</span>
        </div>
        <div className="chip_hack_grid" style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}>
          {Array.from({ length: gridSize * gridSize }, (_, idx) => (
            <div
              key={idx}
              className={`chip_cell ${revealed.has(idx) ? 'revealed' : ''} ${
                found.has(idx) ? 'found' : ''
              }`}
              onClick={() => handleCellClick(idx)}
            >
              {revealed.has(idx) && chipPositions.includes(idx) && (
                <i className="fa-solid fa-microchip"></i>
              )}
            </div>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
