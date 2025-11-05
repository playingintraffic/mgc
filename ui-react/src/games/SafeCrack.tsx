import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, SafeCrackData } from '@/types';
import { useKeyPress } from '@hooks/useKeyPress';
import { audioManager } from '@utils/audio';
import '../styles/games/SafeCrack.css';

interface Ring {
  radius: number;
  markerNotch: number;
  rotatingNotch: number;
  notchAligned: boolean;
  alignedSound?: boolean;
}

export const SafeCrack: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as SafeCrackData;
  const difficulty = gameData.difficulty || 3;

  const [rings, setRings] = useState<Ring[]>([]);
  const [selectedRingIndex, setSelectedRingIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [dialRotation, setDialRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialDirection = useRef(Math.random() < 0.5 ? 'left' : 'right');
  const isRotating = useRef(false);

  useEffect(() => {
    const newRings: Ring[] = [];
    for (let i = 0; i < difficulty; i++) {
      newRings.push({
        radius: 40 * difficulty - i * 50,
        markerNotch: Math.random() * Math.PI * 2,
        rotatingNotch: Math.random() * Math.PI * 2,
        notchAligned: false,
      });
    }
    setRings(newRings);
    setSelectedRingIndex(newRings.length - 1);
  }, [difficulty]);

  useEffect(() => {
    if (!canvasRef.current || rings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const center = { x: 500, y: 500 };
    const ringThickness = 21;
    const notchWidth = 0.3;
    const notch2 = 0.05;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rings.forEach((ring) => {
      // Draw main ring
      ctx.beginPath();
      ctx.arc(center.x, center.y, ring.radius, 0, Math.PI * 2);
      ctx.lineWidth = ringThickness;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // Draw marker notch
      ctx.beginPath();
      ctx.arc(
        center.x,
        center.y,
        ring.radius,
        ring.markerNotch - notchWidth / 2,
        ring.markerNotch + notchWidth / 2
      );
      ctx.lineWidth = ringThickness;
      ctx.strokeStyle = 'rgba(228, 173, 41, 0.8)';
      ctx.stroke();

      // Draw rotating notch
      ctx.beginPath();
      ctx.arc(
        center.x,
        center.y,
        ring.radius,
        ring.rotatingNotch - notch2 / 2,
        ring.rotatingNotch + notch2 / 2
      );
      ctx.lineWidth = ringThickness;
      ctx.strokeStyle = ring.notchAligned ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
      ctx.stroke();
    });
  }, [rings]);

  const rotateRing = (index: number, delta: number) => {
    if (isRotating.current) return;
    isRotating.current = true;

    setRings((prevRings) => {
      const newRings = [...prevRings];
      newRings[index].rotatingNotch =
        (newRings[index].rotatingNotch + delta + Math.PI * 2) % (Math.PI * 2);

      // Check alignment zone for sound
      const ring = newRings[index];
      const tolerance = 0.15;
      const angleDiff = Math.abs(ring.rotatingNotch - ring.markerNotch);
      const effectiveDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);

      if (effectiveDiff < tolerance && !ring.alignedSound) {
        audioManager.play('safe_lock_4', 0.8);
        ring.alignedSound = true;
      } else if (effectiveDiff >= tolerance) {
        ring.alignedSound = false;
      }

      return newRings;
    });

    setDialRotation((prev) => prev + delta * (180 / Math.PI));

    setTimeout(() => {
      isRotating.current = false;
    }, 10);
  };

  const updateNotchAlignment = (index: number) => {
    setRings((prevRings) => {
      const newRings = [...prevRings];
      const ring = newRings[index];
      const tolerance = 0.1;
      const angleDiff = Math.abs(ring.rotatingNotch - ring.markerNotch);
      const effectiveDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
      ring.notchAligned = effectiveDiff < tolerance;

      if (ring.notchAligned) {
        // Find next unaligned ring
        const nextIndex = newRings.findIndex((r, i) => !r.notchAligned && i > index);
        setSelectedRingIndex(nextIndex);

        // Check if all aligned
        if (newRings.every((r) => r.notchAligned)) {
          setGameSuccess(true);
          setShowResult(true);
          setTimeout(() => onComplete(true), 2000);
        }
      }

      return newRings;
    });
  };

  useKeyPress({
    onKeyDown: (e) => {
      if (showResult) return;

      const index = rings.findIndex((r) => !r.notchAligned);
      if (index === -1) return;

      const rotationStep = 0.1;
      const direction =
        index % 2 === 0
          ? initialDirection.current
          : initialDirection.current === 'left'
          ? 'right'
          : 'left';
      const directionKey = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';

      if (e.key === directionKey) {
        e.preventDefault();
        const delta = direction === 'left' ? -rotationStep : rotationStep;
        rotateRing(index, delta);
        audioManager.play(
          direction === 'left' ? 'safe_lock_1' : 'safe_lock_2',
          0.2
        );
      }

      if (e.key === ' ') {
        e.preventDefault();
        updateNotchAlignment(index);
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
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
    <GameContainer title="SAFE CRACK" className="safe-crack-game">
      <div className="sc_container">
        <canvas ref={canvasRef} id="sc_canvas" width="1000" height="1000"></canvas>
        <div className="sc_lock_container">
          <div className="sc_dial" style={{ transform: `rotate(${dialRotation}deg)` }}>
            {Array.from({ length: 60 }, (_, i) => {
              const isMarker = i % 5 === 0;
              return (
                <div
                  key={i}
                  className="sc_numbers"
                  style={{
                    transform: `rotate(${i * 6}deg) ${
                      isMarker ? 'translateY(-95px)' : 'translateY(-115px)'
                    }`,
                    fontSize: isMarker ? '0.8rem' : '1rem',
                  }}
                >
                  {isMarker ? (i / 5) * 5 : '|'}
                </div>
              );
            })}
          </div>
          <div className="sc_dial_center"></div>
        </div>
        <div className="lock_icons_container">
          <div className="lock_icons">
            {rings.map((ring, i) => (
              <React.Fragment key={i}>
                <i
                  className={`fas ${ring.notchAligned ? 'fa-lock-open' : 'fa-lock'}`}
                  style={{
                    color: ring.notchAligned
                      ? 'var(--accent)'
                      : 'rgba(180, 180, 180, 0.25)',
                  }}
                ></i>
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </GameContainer>
  );
};
