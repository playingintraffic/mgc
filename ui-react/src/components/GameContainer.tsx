import React from 'react';
import '../styles/GameContainer.css';

interface GameContainerProps {
  children: React.ReactNode;
  title?: string;
  timer?: number;
  className?: string;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  children,
  title,
  timer,
  className = '',
}) => {
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className={`minigame_container ${className}`}>
      {(title || timer !== undefined) && (
        <div className="minigame_header">
          {title && <div className="minigame_title">{title}</div>}
          {timer !== undefined && (
            <div className="minigame_timer">{formatTime(timer)}</div>
          )}
        </div>
      )}
      <div className="minigame_content">{children}</div>
    </div>
  );
};
