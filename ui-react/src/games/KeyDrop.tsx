import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, KeyDropData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import '../styles/games/KeyDrop.css';

interface FallingKey {
  id: number;
  letter: string;
  x: number;
  y: number;
  speed: number;
}

export const KeyDrop: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as KeyDropData;
  const speed = gameData.speed || 1;
  const timerDuration = gameData.timer || 30000;

  const [keys, setKeys] = useState<FallingKey[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const maxMisses = 5;
  const targetScore = 10;
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const nextIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(score >= targetScore);
      setShowResult(true);
      setTimeout(() => onComplete(score >= targetScore), 2000);
    },
  });

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const newKey: FallingKey = {
        id: nextIdRef.current++,
        letter: randomLetter,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: 0.5 + speed * 0.5,
      };
      setKeys((prev) => [...prev, newKey]);
    }, 1500 / speed);

    return () => clearInterval(spawnInterval);
  }, [speed]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setKeys((prevKeys) => {
        const updated = prevKeys.map((key) => ({
          ...key,
          y: key.y + key.speed,
        }));

        const filtered = updated.filter((key) => {
          if (key.y > 110) {
            setMisses((prev) => {
              const newMisses = prev + 1;
              if (newMisses >= maxMisses) {
                setGameSuccess(false);
                setShowResult(true);
                setTimeout(() => onComplete(false), 2000);
              }
              return newMisses;
            });
            return false;
          }
          return true;
        });

        return filtered;
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, [maxMisses, onComplete]);

  useKeyPress({
    onKeyDown: (e) => {
      const pressedLetter = e.key.toUpperCase();
      setKeys((prevKeys) => {
        const matchIndex = prevKeys.findIndex((key) => key.letter === pressedLetter);
        if (matchIndex !== -1) {
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= targetScore) {
              setGameSuccess(true);
              setShowResult(true);
              setTimeout(() => onComplete(true), 2000);
            }
            return newScore;
          });
          return prevKeys.filter((_, idx) => idx !== matchIndex);
        }
        return prevKeys;
      });
    },
    enabled: !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="KEY DROP" timer={timeLeft} className="key-drop-game">
      <div className="key_drop_container" ref={containerRef}>
        <div className="key_drop_info">
          <span>Score: {score} / {targetScore}</span>
          <span>Misses: {misses} / {maxMisses}</span>
        </div>
        <div className="key_drop_area">
          {keys.map((key) => (
            <div
              key={key.id}
              className="falling_key"
              style={{
                left: `${key.x}%`,
                top: `${key.y}%`,
              }}
            >
              {key.letter}
            </div>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
