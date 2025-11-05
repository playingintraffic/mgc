import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, PulseSyncData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import { audioManager } from '@utils/audio';
import '../styles/games/PulseSync.css';

export const PulseSync: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as PulseSyncData;
  const requiredPulses = gameData.pulses || 5;
  const timerDuration = gameData.timer || 30000;

  const [pulses, setPulses] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [scale, setScale] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const pulseInterval = 1500;
  const perfectWindow = 200;

  const lastPulseTimeRef = useRef(Date.now());
  const animationRef = useRef<number>();

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(pulses >= requiredPulses);
      setShowResult(true);
      setTimeout(() => onComplete(pulses >= requiredPulses), 2000);
    },
  });

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const timeSincePulse = now - lastPulseTimeRef.current;
      const phase = (timeSincePulse % pulseInterval) / pulseInterval;

      // Create pulse effect
      const newScale = 1 + Math.sin(phase * Math.PI * 2) * 0.3;
      setScale(newScale);
      setIsPulsing(phase > 0.4 && phase < 0.6);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePulse = () => {
    if (showResult) return;

    const now = Date.now();
    const timeSincePulse = now - lastPulseTimeRef.current;
    const phase = (timeSincePulse % pulseInterval) / pulseInterval;

    // Check if in perfect window
    if (phase > 0.4 && phase < 0.6) {
      const newPulses = pulses + 1;
      setPulses(newPulses);
      audioManager.play('beep', 0.3);

      if (newPulses >= requiredPulses) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      }
    } else {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    }
  };

  useKeyPress({
    onKeyDown: (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        handlePulse();
      }
    },
    enabled: !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="PULSE SYNC" timer={timeLeft} className="pulse-sync-game">
      <div className="pulse_sync_container">
        <div className="pulse_sync_info">
          Press SPACE when the circle is at its largest!
          <br />
          Syncs: {pulses} / {requiredPulses}
        </div>
        <div className="pulse_sync_area">
          <div
            className={`pulse_circle ${isPulsing ? 'pulsing' : ''}`}
            style={{
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </GameContainer>
  );
};
