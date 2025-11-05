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
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
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
