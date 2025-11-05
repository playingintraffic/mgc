import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, FrequencyJamData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/FrequencyJam.css';

interface Dial {
  id: number;
  targetValue: number;
  currentValue: number;
}

export const FrequencyJam: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as FrequencyJamData;
  const dialCount = gameData.dials || 3;
  const timerDuration = gameData.timer || 30000;

  const [dials, setDials] = useState<Dial[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const tolerance = 5;

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
    const newDials: Dial[] = [];
    for (let i = 0; i < dialCount; i++) {
      newDials.push({
        id: i,
        targetValue: Math.floor(Math.random() * 100),
        currentValue: Math.floor(Math.random() * 100),
      });
    }
    setDials(newDials);
  }, [dialCount]);

  const handleDialChange = (id: number, value: number) => {
    setDials((prev) =>
      prev.map((dial) => (dial.id === id ? { ...dial, currentValue: value } : dial))
    );
  };

  const checkFrequencies = () => {
    const allMatch = dials.every(
      (dial) => Math.abs(dial.currentValue - dial.targetValue) <= tolerance
    );

    if (allMatch) {
      setGameSuccess(true);
      setShowResult(true);
      setTimeout(() => onComplete(true), 2000);
    } else {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="FREQUENCY JAM" timer={timeLeft} className="frequency-jam-game">
      <div className="frequency_jam_container">
        <div className="frequency_jam_info">Match the target frequencies</div>
        <div className="frequency_jam_dials">
          {dials.map((dial) => (
            <div key={dial.id} className="dial_container">
              <div className="dial_label">
                Target: {dial.targetValue} Hz
                <br />
                Current: {dial.currentValue} Hz
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dial.currentValue}
                onChange={(e) => handleDialChange(dial.id, parseInt(e.target.value))}
                className="dial_slider"
              />
              <div className="dial_visual" style={{
                background: `conic-gradient(
                  var(--accent) ${(dial.currentValue / 100) * 360}deg,
                  rgba(255, 255, 255, 0.1) ${(dial.currentValue / 100) * 360}deg
                )`
              }}>
                <div className="dial_center">{dial.currentValue}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="frequency_jam_submit" onClick={checkFrequencies}>
          Lock Frequency
        </button>
      </div>
    </GameContainer>
  );
};
