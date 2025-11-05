import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, WireCutData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/WireCut.css';

interface Wire {
  leftY: number;
  rightY: number;
  color: string;
  isCorrect: boolean;
  isCut: boolean;
}

export const WireCut: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as WireCutData;
  const timerDuration = gameData.timer || 60000;

  const [wires, setWires] = useState<Wire[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [hoveredWire, setHoveredWire] = useState<number | null>(null);

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
    const colors = [
      'rgb(120, 0, 0)',
      'rgb(0, 88, 0)',
      'rgb(0, 0, 160)',
      'rgb(160, 160, 0)',
      'rgb(88, 0, 88)',
      'rgb(215, 100, 0)',
    ];

    const correctWire = Math.floor(Math.random() * 6);
    const rightPositions = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);

    const newWires: Wire[] = colors.map((color, idx) => ({
      leftY: 38 + idx * 38,
      rightY: 38 + rightPositions[idx] * 38,
      color,
      isCorrect: rightPositions[idx] === correctWire,
      isCut: false,
    }));

    setWires(newWires);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const leftX = 30;
    const rightX = 270;

    wires.forEach((wire, idx) => {
      if (wire.isCut) return;

      ctx.beginPath();
      ctx.moveTo(leftX, wire.leftY);
      ctx.bezierCurveTo(
        leftX + 100,
        wire.leftY,
        rightX - 100,
        wire.rightY,
        rightX,
        wire.rightY
      );

      if (hoveredWire === idx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = wire.color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();

      // Draw end circles
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(leftX, wire.leftY, 5, 0, Math.PI * 2);
      ctx.fillStyle = wire.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rightX, wire.rightY, 5, 0, Math.PI * 2);
      ctx.fillStyle = wire.color;
      ctx.fill();
    });
  }, [wires, hoveredWire]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (showResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    wires.forEach((wire, idx) => {
      if (wire.isCut) return;

      const dist = Math.abs(y - wire.leftY);
      if (dist < 10 && x > 30 && x < 270) {
        if (wire.isCorrect) {
          setGameSuccess(true);
          setShowResult(true);
          setTimeout(() => onComplete(true), 2000);
        } else {
          setGameSuccess(false);
          setShowResult(true);
          setTimeout(() => onComplete(false), 2000);
        }
      }
    });
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    let found = -1;
    wires.forEach((wire, idx) => {
      if (wire.isCut) return;
      const dist = Math.abs(y - wire.leftY);
      if (dist < 15) {
        found = idx;
      }
    });

    setHoveredWire(found);
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="WIRE CUT" timer={timeLeft} className="wire-cut-game">
      <div className="wire_cut_container">
        <canvas
          ref={canvasRef}
          width="300"
          height="265"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoveredWire(null)}
          style={{ cursor: 'crosshair' }}
        />
      </div>
    </GameContainer>
  );
};
