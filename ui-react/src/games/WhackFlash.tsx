import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, WhackFlashData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/WhackFlash.css';

export const WhackFlash: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as WhackFlashData;
  const requiredHits = gameData.hits || 10;
  const timerDuration = gameData.timer || 30000;

  const [activeTarget, setActiveTarget] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const gridSize = 9;

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(hits >= requiredHits);
      setShowResult(true);
      setTimeout(() => onComplete(hits >= requiredHits), 2000);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showResult) {
        setActiveTarget(Math.floor(Math.random() * gridSize));
        setTimeout(() => setActiveTarget(null), 800);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [showResult, gridSize]);

  const handleCellClick = (index: number) => {
    if (showResult) return;

    if (index === activeTarget) {
      const newHits = hits + 1;
      setHits(newHits);
      setActiveTarget(null);

      if (newHits >= requiredHits) {
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
    <GameContainer title="WHACK FLASH" timer={timeLeft} className="whack-flash-game">
      <div className="whack_flash_container">
        <div className="whack_flash_info">
          Hits: {hits} / {requiredHits}
        </div>
        <div className="whack_flash_grid">
          {Array.from({ length: gridSize }, (_, idx) => (
            <div
              key={idx}
              className={`whack_cell ${activeTarget === idx ? 'active' : ''}`}
              onClick={() => handleCellClick(idx)}
            >
              {activeTarget === idx && <i className="fa-solid fa-bolt"></i>}
            </div>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
