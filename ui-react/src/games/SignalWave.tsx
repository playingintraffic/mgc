import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, SignalWaveData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import '../styles/games/SignalWave.css';

export const SignalWave: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as SignalWaveData;
  const difficulty = gameData.difficulty || 3;
  const timerDuration = gameData.timer || 20000;

  const [targetWave, setTargetWave] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const wave: number[] = [];
    for (let i = 0; i < difficulty * 2; i++) {
      wave.push(Math.random() > 0.5 ? 1 : -1);
    }
    setTargetWave(wave);
  }, [difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || targetWave.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const segmentWidth = width / targetWave.length;

    ctx.clearRect(0, 0, width, height);

    // Draw target wave
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    targetWave.forEach((value, idx) => {
      const x = idx * segmentWidth;
      const y = centerY + value * 50;
      ctx.lineTo(x, y);
      ctx.lineTo(x + segmentWidth, y);
    });
    ctx.strokeStyle = 'rgba(228, 173, 41, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw current position marker
    if (currentPosition < targetWave.length) {
      const x = currentPosition * segmentWidth;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }, [targetWave, currentPosition]);

  useKeyPress({
    onKeyDown: (e) => {
      if (showResult || currentPosition >= targetWave.length) return;

      const expectedValue = targetWave[currentPosition];
      let inputValue = 0;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        inputValue = 1;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        inputValue = -1;
      } else {
        return;
      }

      e.preventDefault();

      if (inputValue === expectedValue) {
        const newPosition = currentPosition + 1;
        setCurrentPosition(newPosition);

        if (newPosition >= targetWave.length) {
          setGameSuccess(true);
          setShowResult(true);
          setTimeout(() => onComplete(true), 2000);
        }
      } else {
        setGameSuccess(false);
        setShowResult(true);
        setTimeout(() => onComplete(false), 2000);
      }
    },
    enabled: !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="SIGNAL WAVE" timer={timeLeft} className="signal-wave-game">
      <div className="signal_wave_container">
        <div className="signal_wave_info">
          Match the wave pattern with UP/DOWN arrows
          <br />
          Progress: {currentPosition} / {targetWave.length}
        </div>
        <canvas ref={canvasRef} width="400" height="200" />
      </div>
    </GameContainer>
  );
};
