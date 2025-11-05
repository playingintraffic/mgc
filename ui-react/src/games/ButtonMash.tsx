import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, ButtonMashData } from '@/types';
import { useKeyPress } from '@hooks/useKeyPress';
import { audioManager } from '@utils/audio';
import '../styles/games/ButtonMash.css';

export const ButtonMash: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as ButtonMashData;
  const difficulty = gameData.difficulty || 1;

  const [currentKey, setCurrentKey] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [gameActive, setGameActive] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const notchLengthRef = useRef(0);
  const targetNotchLength = Math.PI * 2;
  const notchIncrement = (Math.PI / 10) / difficulty;
  const notchDecrement = notchIncrement / 2.5;
  const decrementIntervalRef = useRef<number>();
  const isKeyActiveRef = useRef(false);

  useEffect(() => {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentKey(randomKey);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background circle
      ctx.beginPath();
      ctx.arc(center.x, center.y, 100, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 35;
      ctx.stroke();

      // Draw progress arc with gradient
      if (notchLengthRef.current > 0) {
        const gradient = ctx.createConicGradient(0, center.x, center.y);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(0.33, 'rgba(255, 128, 0, 1)');
        gradient.addColorStop(0.66, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');

        ctx.beginPath();
        ctx.arc(center.x, center.y, 100, 0, notchLengthRef.current);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 35;
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    draw();
  }, [notchLengthRef.current]);

  const redraw = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(center.x, center.y, 100, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 35;
    ctx.stroke();

    // Draw progress arc
    if (notchLengthRef.current > 0) {
      const gradient = ctx.createConicGradient(0, center.x, center.y);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
      gradient.addColorStop(0.33, 'rgba(255, 128, 0, 1)');
      gradient.addColorStop(0.66, 'rgba(255, 255, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');

      ctx.beginPath();
      ctx.arc(center.x, center.y, 100, 0, notchLengthRef.current);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 35;
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const increaseNotch = () => {
    if (gameActive && notchLengthRef.current < targetNotchLength) {
      notchLengthRef.current += notchIncrement;
      redraw();
      if (notchLengthRef.current >= targetNotchLength) {
        endGame(true);
      }
    }
  };

  const decreaseNotch = () => {
    if (gameActive && notchLengthRef.current > 0) {
      notchLengthRef.current -= notchDecrement;
      notchLengthRef.current = Math.max(notchLengthRef.current, 0);
      redraw();
      if (notchLengthRef.current <= 0) {
        endGame(false);
      }
    }
  };

  const startDecrementInterval = () => {
    decrementIntervalRef.current = window.setInterval(() => {
      if (!isKeyActiveRef.current) {
        decreaseNotch();
      }
    }, 100);
  };

  const endGame = (success: boolean) => {
    if (gameActive) {
      setGameActive(false);
      setGameSuccess(success);
      setShowResult(true);
      if (decrementIntervalRef.current) {
        clearInterval(decrementIntervalRef.current);
      }
      setTimeout(() => {
        onComplete(success);
      }, 2000);
    }
  };

  useKeyPress({
    onKeyDown: (e) => {
      if (e.key.toUpperCase() === currentKey && gameActive && !showResult) {
        if (!isKeyActiveRef.current) {
          isKeyActiveRef.current = true;
          if (decrementIntervalRef.current) {
            clearInterval(decrementIntervalRef.current);
          }
        }
        increaseNotch();
      }
    },
    onKeyUp: (e) => {
      if (e.key.toUpperCase() === currentKey && gameActive && !showResult) {
        isKeyActiveRef.current = false;
        startDecrementInterval();
      }
    },
    enabled: gameActive && !showResult,
  });

  useEffect(() => {
    return () => {
      if (decrementIntervalRef.current) {
        clearInterval(decrementIntervalRef.current);
      }
    };
  }, []);

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="BUTTON MASH" className="button-mash-game">
      <div className="button_mash_container">
        <canvas ref={canvasRef} id="button_mash_canvas" width="300" height="300"></canvas>
        <span className="button_mash_info">TAP</span>
        <div className="current_key_display">{currentKey}</div>
      </div>
    </GameContainer>
  );
};
