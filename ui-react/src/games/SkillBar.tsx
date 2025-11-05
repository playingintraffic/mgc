import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, SkillBarData } from '@/types';
import { useKeyPress } from '@hooks/useKeyPress';
import '../styles/games/SkillBar.css';

export const SkillBar: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as SkillBarData;
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [gameActive, setGameActive] = useState(true);

  const iconClass = gameData.icon || 'fa-solid fa-fish';
  const areaSize = gameData.area_size || 20;
  const speed = gameData.speed || 0.5;
  const iconSpeed = gameData.icon_speed || 3;
  const orientation = gameData.orientation || 1;
  const movingIcon = gameData.moving_icon || false;

  const targetPosRef = useRef(Math.random() * (100 - areaSize));
  const iconPosRef = useRef(Math.random() * (100 - areaSize));
  const movingForwardRef = useRef(true);
  const lastTimeRef = useRef(performance.now());
  const animationRef = useRef<number>();

  const iconRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!gameActive) return;

      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const delta = speed * dt * 60;
      if (movingForwardRef.current) {
        targetPosRef.current += delta;
        if (targetPosRef.current >= 100 - areaSize) {
          targetPosRef.current = 100 - areaSize;
          movingForwardRef.current = false;
        }
      } else {
        targetPosRef.current -= delta;
        if (targetPosRef.current <= 0) {
          targetPosRef.current = 0;
          movingForwardRef.current = true;
        }
      }

      if (targetRef.current) {
        targetRef.current.style.left = `${targetPosRef.current}%`;
      }

      if (movingIcon && iconRef.current && containerRef.current) {
        const diff = targetPosRef.current - iconPosRef.current;
        iconPosRef.current += (diff * iconSpeed * dt) / 10;

        const containerWidth = containerRef.current.offsetWidth;
        const iconWidth = iconRef.current.offsetWidth;
        const iconWidthPercent = (iconWidth / containerWidth) * 100;
        const max = 100 - iconWidthPercent;

        iconPosRef.current = Math.max(0, Math.min(max, iconPosRef.current));
        iconRef.current.style.left = `${iconPosRef.current}%`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, speed, areaSize, iconSpeed, movingIcon]);

  const checkPosition = () => {
    if (!containerRef.current || !iconRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const iconLeft = parseFloat(iconRef.current.style.left || '0');
    const iconPos = (parseFloat(getComputedStyle(iconRef.current).left) / containerWidth) * 100;
    const targetPos = targetPosRef.current;
    const targetWidth = areaSize;

    const success = iconPos >= targetPos && iconPos <= targetPos + targetWidth;
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

  const orientationStyle =
    orientation === 2 ? { transform: 'rotate(-90deg)', top: '0%', left: '30%' } : {};
  const iconOrientation = orientation === 2 ? 'fa-rotate-90' : '';

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="SKILL BAR" className="skill-bar-game">
      <div className="skill_bar_container" style={orientationStyle} ref={containerRef}>
        <div
          className="skill_bar_icon"
          ref={iconRef}
          style={{ left: `${iconPosRef.current}%` }}
        >
          <i className={`${iconClass} ${iconOrientation}`} aria-hidden="true"></i>
        </div>
        <div
          className="skill_bar_target_area"
          ref={targetRef}
          style={{
            width: `${areaSize}%`,
            left: `${targetPosRef.current}%`,
          }}
        >
          <div className="skill_bar_perfect_line"></div>
        </div>
      </div>
    </GameContainer>
  );
};
