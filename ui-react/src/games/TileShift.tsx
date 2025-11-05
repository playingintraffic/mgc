import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, TileShiftData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/TileShift.css';

export const TileShift: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as TileShiftData;
  const gridSize = gameData.grid_size || 3;
  const timerDuration = gameData.timer || 60000;

  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(gridSize * gridSize - 1);
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
    const initialTiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    // Shuffle tiles
    for (let i = 0; i < 100; i++) {
      const emptyIdx = initialTiles.indexOf(gridSize * gridSize - 1);
      const neighbors = getNeighbors(emptyIdx);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [initialTiles[emptyIdx], initialTiles[randomNeighbor]] = [
        initialTiles[randomNeighbor],
        initialTiles[emptyIdx],
      ];
    }

    setTiles(initialTiles);
    setEmptyIndex(initialTiles.indexOf(gridSize * gridSize - 1));
  }, [gridSize]);

  const getNeighbors = (index: number): number[] => {
    const neighbors: number[] = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    if (row > 0) neighbors.push(index - gridSize); // Up
    if (row < gridSize - 1) neighbors.push(index + gridSize); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < gridSize - 1) neighbors.push(index + 1); // Right

    return neighbors;
  };

  const handleTileClick = (index: number) => {
    if (showResult) return;

    const neighbors = getNeighbors(emptyIndex);
    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setEmptyIndex(index);

      // Check if solved
      const isSolved = newTiles.every((tile, idx) => tile === idx);
      if (isSolved) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      }
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="TILE SHIFT" timer={timeLeft} className="tile-shift-game">
      <div className="tile_shift_container" style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}>
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === gridSize * gridSize - 1 ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {tile !== gridSize * gridSize - 1 && tile + 1}
          </div>
        ))}
      </div>
    </GameContainer>
  );
};
