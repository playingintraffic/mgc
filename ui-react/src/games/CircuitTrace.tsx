import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, CircuitTraceData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/CircuitTrace.css';

export const CircuitTrace: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as CircuitTraceData;
  const timerDuration = gameData.timer || 30000;

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetPathRef = useRef<{ x: number; y: number }[]>([]);

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
    // Generate simple path
    const newPath: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      newPath.push({
        x: 50 + i * 50,
        y: 150 + Math.sin(i) * 50,
      });
    }
    targetPathRef.current = newPath;

    drawTargetPath();
  }, []);

  const drawTargetPath = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target path
    ctx.beginPath();
    ctx.moveTo(targetPathRef.current[0].x, targetPathRef.current[0].y);
    for (let i = 1; i < targetPathRef.current.length; i++) {
      ctx.lineTo(targetPathRef.current[i].x, targetPathRef.current[i].y);
    }
    ctx.strokeStyle = 'rgba(228, 173, 41, 0.3)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw checkpoints
    targetPathRef.current.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(228, 173, 41, 0.5)';
      ctx.fill();
    });

    // Draw user path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawTargetPath();
  }, [path]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if near start point
    const startDist = Math.sqrt(
      (x - targetPathRef.current[0].x) ** 2 + (y - targetPathRef.current[0].y) ** 2
    );

    if (startDist < 15) {
      setIsDrawing(true);
      setPath([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPath((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Check if path reaches end
    const lastPoint = path[path.length - 1];
    const endPoint = targetPathRef.current[targetPathRef.current.length - 1];
    const dist = Math.sqrt((lastPoint.x - endPoint.x) ** 2 + (lastPoint.y - endPoint.y) ** 2);

    if (dist < 20) {
      setGameSuccess(true);
      setShowResult(true);
      setTimeout(() => onComplete(true), 2000);
    } else {
      setPath([]);
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="CIRCUIT TRACE" timer={timeLeft} className="circuit-trace-game">
      <div className="circuit_trace_container">
        <div className="circuit_trace_info">Trace the circuit from start to end</div>
        <canvas
          ref={canvasRef}
          width="400"
          height="300"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: 'crosshair' }}
        />
      </div>
    </GameContainer>
  );
};
