import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, BitFlipData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/BitFlip.css';

export const BitFlip: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as BitFlipData;
  const length = gameData.length || 8;
  const timerDuration = gameData.timer || 20000;
  const maxGuesses = gameData.guesses || 3;
  const loadingTime = gameData.loading_time || 3000;

  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(true);
  const [guessesLeft, setGuessesLeft] = useState(maxGuesses);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: !showSequence,
    onExpire: () => {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    },
  });

  useEffect(() => {
    const sequence = Array.from({ length }, () => Math.round(Math.random()));
    setTargetSequence(sequence);
    setUserSequence(Array(length).fill(0));

    setTimeout(() => {
      setShowSequence(false);
    }, loadingTime);
  }, [length, loadingTime]);

  const flipBit = (index: number) => {
    if (showSequence || showResult) return;

    const newSequence = [...userSequence];
    newSequence[index] = newSequence[index] === 0 ? 1 : 0;
    setUserSequence(newSequence);
  };

  const checkSequence = () => {
    const isCorrect = userSequence.every((bit, idx) => bit === targetSequence[idx]);

    if (isCorrect) {
      setGameSuccess(true);
      setShowResult(true);
      setTimeout(() => onComplete(true), 2000);
    } else {
      const newGuesses = guessesLeft - 1;
      setGuessesLeft(newGuesses);

      if (newGuesses <= 0) {
        setGameSuccess(false);
        setShowResult(true);
        setTimeout(() => onComplete(false), 2000);
      } else {
        setUserSequence(Array(length).fill(0));
      }
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer
      title="BIT FLIP"
      timer={!showSequence ? timeLeft : undefined}
      className="bit-flip-game"
    >
      <div className="bit_flip_container">
        {showSequence && (
          <div className="bit_flip_display">
            <div className="bit_flip_label">Memorize the sequence:</div>
            <div className="bit_flip_sequence">
              {targetSequence.map((bit, idx) => (
                <div key={idx} className={`bit ${bit === 1 ? 'active' : ''}`}>
                  {bit}
                </div>
              ))}
            </div>
          </div>
        )}
        {!showSequence && (
          <>
            <div className="bit_flip_display">
              <div className="bit_flip_label">Recreate the sequence:</div>
              <div className="bit_flip_sequence">
                {userSequence.map((bit, idx) => (
                  <div
                    key={idx}
                    className={`bit ${bit === 1 ? 'active' : ''}`}
                    onClick={() => flipBit(idx)}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
            <div className="bit_flip_info">
              Guesses left: {guessesLeft}
            </div>
            <button className="bit_flip_submit" onClick={checkSequence}>
              Submit
            </button>
          </>
        )}
      </div>
    </GameContainer>
  );
};
