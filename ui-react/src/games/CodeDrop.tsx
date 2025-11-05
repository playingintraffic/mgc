import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, CodeDropData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import '../styles/games/CodeDrop.css';

interface FallingCode {
  id: number;
  digit: string;
  x: number;
  y: number;
  speed: number;
}

export const CodeDrop: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as CodeDropData;
  const speed = gameData.speed || 1;
  const timerDuration = gameData.timer || 30000;
  const codeLength = gameData.code_length || 4;

  const [targetCode, setTargetCode] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [fallingCodes, setFallingCodes] = useState<FallingCode[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const nextIdRef = useRef(0);

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
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10);
    }
    setTargetCode(code);
  }, [codeLength]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const digit = Math.floor(Math.random() * 10).toString();
      const newCode: FallingCode = {
        id: nextIdRef.current++,
        digit,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: 0.5 + speed * 0.5,
      };
      setFallingCodes((prev) => [...prev, newCode]);
    }, 1000 / speed);

    return () => clearInterval(spawnInterval);
  }, [speed]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFallingCodes((prev) =>
        prev
          .map((code) => ({ ...code, y: code.y + code.speed }))
          .filter((code) => code.y < 110)
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  useKeyPress({
    onKeyDown: (e) => {
      const digit = e.key;
      if (digit.match(/[0-9]/)) {
        const newCode = currentCode + digit;
        setCurrentCode(newCode);

        // Remove matching falling code
        setFallingCodes((prev) => {
          const matchIndex = prev.findIndex((code) => code.digit === digit);
          if (matchIndex !== -1) {
            return prev.filter((_, idx) => idx !== matchIndex);
          }
          return prev;
        });

        if (newCode.length === targetCode.length) {
          if (newCode === targetCode) {
            setGameSuccess(true);
            setShowResult(true);
            setTimeout(() => onComplete(true), 2000);
          } else {
            setCurrentCode('');
          }
        }
      }
    },
    enabled: !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="CODE DROP" timer={timeLeft} className="code-drop-game">
      <div className="code_drop_container">
        <div className="code_drop_header">
          <div className="target_code">Target: {targetCode}</div>
          <div className="current_code">
            Input: {currentCode.padEnd(codeLength, '_')}
          </div>
        </div>
        <div className="code_drop_area">
          {fallingCodes.map((code) => (
            <div
              key={code.id}
              className="falling_code"
              style={{
                left: `${code.x}%`,
                top: `${code.y}%`,
              }}
            >
              {code.digit}
            </div>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
