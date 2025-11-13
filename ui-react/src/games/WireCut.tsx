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
  const maxChances = gameData.chances || 1;

  const [wires, setWires] = useState<Wire[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [hoveredWire, setHoveredWire] = useState<number | null>(null);
  const [remainingChances, setRemainingChances] = useState(maxChances);

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
        ctx.strokeStyle = '#e4ad29';
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(228, 173, 41, 0.9)';
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = wire.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
      }

      ctx.stroke();

      // Draw end circles with gradient
      const isHovered = hoveredWire === idx;
      const radius = 8;

      // Left circle
      const leftGradient = ctx.createRadialGradient(
        leftX,
        wire.leftY,
        radius * 0.1,
        leftX,
        wire.leftY,
        radius
      );
      leftGradient.addColorStop(0, isHovered ? '#ffe8b0' : '#999');
      leftGradient.addColorStop(0.5, isHovered ? '#e4ad29' : '#777');
      leftGradient.addColorStop(1, isHovered ? '#a47414' : '#333');

      ctx.shadowColor = isHovered ? 'rgba(228, 173, 41, 0.9)' : 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = isHovered ? 8 : 4;
      ctx.beginPath();
      ctx.arc(leftX, wire.leftY, radius, 0, Math.PI * 2);
      ctx.fillStyle = leftGradient;
      ctx.fill();

      // Right circle
      const rightGradient = ctx.createRadialGradient(
        rightX,
        wire.rightY,
        radius * 0.1,
        rightX,
        wire.rightY,
        radius
      );
      rightGradient.addColorStop(0, isHovered ? '#ffe8b0' : '#999');
      rightGradient.addColorStop(0.5, isHovered ? '#e4ad29' : '#777');
      rightGradient.addColorStop(1, isHovered ? '#a47414' : '#333');

      ctx.beginPath();
      ctx.arc(rightX, wire.rightY, radius, 0, Math.PI * 2);
      ctx.fillStyle = rightGradient;
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
    const hitRadius = 10;
    const leftX = 30;
    const rightX = 270;

    for (let idx = 0; idx < wires.length; idx++) {
      const wire = wires[idx];
      if (wire.isCut) continue;

      const distLeft = Math.hypot(x - leftX, y - wire.leftY);
      const distRight = Math.hypot(x - rightX, y - wire.rightY);

      if (distLeft <= hitRadius || distRight <= hitRadius) {
        setWires((prev) =>
          prev.map((w, i) => (i === idx ? { ...w, isCut: true } : w))
        );

        if (wire.isCorrect) {
          setGameSuccess(true);
          setShowResult(true);
          setTimeout(() => onComplete(true), 2000);
        } else {
          const newChances = remainingChances - 1;
          setRemainingChances(newChances);

          if (newChances <= 0) {
            setGameSuccess(false);
            setShowResult(true);
            setTimeout(() => onComplete(false), 2000);
          }
        }
        break;
      }
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hitRadius = 10;
    const leftX = 30;
    const rightX = 270;

    let found = -1;
    for (let idx = 0; idx < wires.length; idx++) {
      const wire = wires[idx];
      if (wire.isCut) continue;

      const distLeft = Math.hypot(x - leftX, y - wire.leftY);
      const distRight = Math.hypot(x - rightX, y - wire.rightY);

      if (distLeft <= hitRadius || distRight <= hitRadius) {
        found = idx;
        break;
      }
    }

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
