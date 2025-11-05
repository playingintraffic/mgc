import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, SkillCircleData } from '@/types';
import { useKeyPress } from '@hooks/useKeyPress';
import '../styles/games/SkillCircle.css';

export const SkillCircle: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as SkillCircleData;
  const iconClass = gameData.icon || 'fa-solid fa-fish';
  const perfectAreaSize = gameData.perfect_area_size || 10;
  const speed = gameData.speed || 2;

  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [gameActive, setGameActive] = useState(true);

  const rotationRef = useRef(0);
  const targetAngleRef = useRef(Math.random() * 360);
  const animationRef = useRef<number>();
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = () => {
      if (!gameActive) return;

      rotationRef.current = (rotationRef.current + speed) % 360;

      if (iconRef.current) {
        iconRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationRef.current}deg) translateY(-120px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, speed]);

  const checkPosition = () => {
    const currentAngle = rotationRef.current;
    const targetAngle = targetAngleRef.current;

    let diff = Math.abs(currentAngle - targetAngle);
    if (diff > 180) {
      diff = 360 - diff;
    }

    const success = diff <= perfectAreaSize;
    setGameSuccess(success);
    setShowResult(true);
    setGameActive(false);

    setTimeout(() => {
      onComplete(success);
    }, 2000);
  };

  useKeyPress({
    onKeyDown: (e) => {
      if (e.key === ' ' && gameActive) {
        e.preventDefault();
        checkPosition();
      }
    },
    enabled: gameActive && !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="SKILL CIRCLE" className="skill-circle-game">
      <div className="skill_circle_container">
        <div className="skill_circle_outer">
          <div
            className="skill_circle_target"
            style={{
              transform: `rotate(${targetAngleRef.current}deg)`,
              width: `${perfectAreaSize * 2}%`,
            }}
          ></div>
          <div ref={iconRef} className="skill_circle_icon">
            <i className={iconClass} aria-hidden="true"></i>
          </div>
        </div>
        <div className="skill_circle_info">Press SPACE to stop</div>
      </div>
    </GameContainer>
  );
};
