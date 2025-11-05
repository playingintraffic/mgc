import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, PatternLockData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/PatternLock.css';

export const PatternLock: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as PatternLockData;
  const loadingTime = gameData.loading_time || 3000;
  const maxGuesses = gameData.guesses || 3;
  const timerDuration = gameData.timer || 20000;

  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [guessesLeft, setGuessesLeft] = useState(maxGuesses);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<{ x: number; y: number }[]>([]);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: !showPattern,
    onExpire: () => {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    },
  });

  useEffect(() => {
    // Generate random pattern
    const patternLength = 3 + Math.floor(Math.random() * 3);
    const newPattern: number[] = [];
    while (newPattern.length < patternLength) {
      const dot = Math.floor(Math.random() * 9);
      if (!newPattern.includes(dot)) {
        newPattern.push(dot);
      }
    }
    setPattern(newPattern);

    // Setup dots
    const canvas = canvasRef.current;
    if (canvas) {
      const size = 400;
      const spacing = size / 4;
      const offset = spacing;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          dots.current.push({
            x: offset + col * spacing,
            y: offset + row * spacing,
          });
        }
      }
    }

    setTimeout(() => {
      setShowPattern(false);
    }, loadingTime);
  }, [loadingTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dots
    dots.current.forEach((dot, idx) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = showPattern && pattern.includes(idx)
        ? 'rgba(228, 173, 41, 0.8)'
        : userPattern.includes(idx)
        ? 'rgba(0, 255, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    });

    // Draw lines for pattern
    const currentPattern = showPattern ? pattern : userPattern;
    if (currentPattern.length > 1) {
      ctx.beginPath();
      ctx.moveTo(dots.current[currentPattern[0]].x, dots.current[currentPattern[0]].y);
      for (let i = 1; i < currentPattern.length; i++) {
        ctx.lineTo(dots.current[currentPattern[i]].x, dots.current[currentPattern[i]].y);
      }
      ctx.strokeStyle = showPattern
        ? 'rgba(228, 173, 41, 0.5)'
        : 'rgba(0, 255, 0, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [pattern, userPattern, showPattern]);

  const handleMouseDown = () => {
    if (!showPattern && !showResult) {
      setIsDrawing(true);
      setUserPattern([]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || showPattern || showResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dots.current.forEach((dot, idx) => {
      const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      if (dist < 30 && !userPattern.includes(idx)) {
        setUserPattern((prev) => [...prev, idx]);
      }
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (userPattern.length > 0) {
      const isCorrect =
        userPattern.length === pattern.length &&
        userPattern.every((val, idx) => val === pattern[idx]);

      if (isCorrect) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      } else {
        const newGuesses = guessesLeft - 1;
        setGuessesLeft(newGuesses);
        setUserPattern([]);

        if (newGuesses <= 0) {
          setGameSuccess(false);
          setShowResult(true);
          setTimeout(() => onComplete(false), 2000);
        }
      }
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer
      title="PATTERN LOCK"
      timer={!showPattern ? timeLeft : undefined}
      className="pattern-lock-game"
    >
      <div className="pattern_lock_container">
        {showPattern && <div className="pattern_lock_info">Memorize the pattern...</div>}
        {!showPattern && (
          <div className="pattern_lock_info">
            Draw the pattern | Guesses: {guessesLeft}
          </div>
        )}
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: showPattern ? 'default' : 'crosshair' }}
        />
      </div>
    </GameContainer>
  );
};
